const std = @import("std");
const file = @embedFile("./index.json");

/// Log string from WASM memory buffer
extern fn console(buf: usize, len: usize) void;

/// Calculate the blog post age in days
extern fn getAge(buf: usize, len: usize) usize;

/// Post search results to the web worker
extern fn setSearch(buf: usize, len: usize) void;

const Ref = extern struct {
    hash: [4]u8,
    occurrences: u8,
};

/// Index
const Word = struct {
    word: []const u8,
    pages: [*]const Ref,
    pages_len: u16,
};

/// Page data
const Page = struct {
    hash: *const [4]u8,
    href: []const u8,
    title: []const u8,
};

/// Search result
const Result = struct {
    page: *const Page,
    distance: i16 = 0,
    occurrences: f64 = 0.0,
    age: f64 = 0.0,
    score: f64 = 0.0,
};

/// Parsed JSON
const Index = struct {
    words: std.ArrayListUnmanaged(Word),
    pages: std.ArrayListUnmanaged(*const Page),
    map: std.StringHashMapUnmanaged(*const Page) = .empty,
};

const wasm_allocator = std.heap.wasm_allocator;

/// Output buffer
var scratch: []u8 = undefined;
const scratch_len: usize = 1024 * 10;

/// Parsed  JSON
var index: Index = .{
    .pages = .empty,
    .words = .empty,
    .map = .empty,
};

/// Formatted print to browser console
fn print(comptime fmt: []const u8, args: anytype) void {
    const slice = std.fmt.bufPrint(scratch, fmt, args) catch unreachable;
    console(@intFromPtr(slice.ptr), slice.len);
}

/// Uh-oh!
fn panic(err: anyerror, message: []const u8) noreturn {
    @branchHint(.cold);
    print("Error: [{s}] {s}", .{ @errorName(err), message });
    @trap();
}

inline fn idx(i: usize, j: usize, k: usize) usize {
    return i * k + j;
}

// Levenshtein Distance
// https://github.com/bcvery1/levenshtein/blob/main/src/levenshtein.zig
// https://gist.github.com/travisstaloch/b377c953c3101249b30405afff4c067d
fn levenshteinDistance(allocator: std.mem.Allocator, a: []const u8, b: []const u8) u16 {
    const n = a.len;
    const m = b.len;
    const table = allocator.alloc(u8, (n + 1) * (m + 1)) catch |err| {
        panic(err, "levenshtein alloc");
    };
    // defer wasm_allocator.free(table);
    table[0] = 0;
    for (1..n + 1) |i| table[idx(i, 0, m + 1)] = @truncate(i);
    for (1..m + 1) |i| table[i] = @truncate(i);
    for (1..n + 1) |i| {
        for (1..m + 1) |j| {
            table[idx(i, j, m + 1)] = @min(
                table[idx(i - 1, j, m + 1)] + 1,
                table[idx(i, j - 1, m + 1)] + 1,
                table[idx(i - 1, j - 1, m + 1)] +
                    @intFromBool(a[i - 1] != b[j - 1]),
            );
        }
    }
    return table[table.len - 1];
}

/// Find page in array list by pointer
fn findResult(list: *[]Result, page: *const Page) ?*Result {
    for (list.*) |*r| {
        if (@as(usize, @intFromPtr(r.page)) == @as(usize, @intFromPtr(page))) {
            return r;
        }
    }
    return null;
}

fn search(query: []const []const u8) !void {
    var arena: std.heap.ArenaAllocator = .init(wasm_allocator);
    defer arena.deinit();
    const allocator = arena.allocator();

    const max_distance = 5;

    var links: std.ArrayListUnmanaged(Result) = .empty;

    for (query) |query_word| {
        var word_list: std.ArrayListUnmanaged(*Word) = .empty;
        var word_map: std.AutoArrayHashMapUnmanaged(*Word, i16) = .empty;
        var results: std.ArrayListUnmanaged(Result) = .empty;

        // Match index words based on distance
        for (index.words.items) |*entry| {
            var distance: i16 = @intCast(levenshteinDistance(allocator, query_word, entry.word));
            if (std.mem.startsWith(u8, entry.word, query_word)) {
                distance -= 2;
            }
            if (std.mem.startsWith(u8, query_word, entry.word)) {
                distance -= 1;
            }
            if (distance <= max_distance) {
                word_map.put(allocator, entry, distance) catch |err| {
                    panic(err, "word map alloc");
                };
                word_list.append(allocator, entry) catch |err| {
                    panic(err, "word list alloc");
                };
            }
        }

        // Sort matches by shortest distance
        std.mem.sort(*Word, word_list.items, word_map, struct {
            fn lessThanFn(map: @TypeOf(word_map), lhs: *Word, rhs: *Word) bool {
                return map.get(lhs).? < map.get(rhs).?;
            }
        }.lessThanFn);

        // Track min/max values to normalize later
        var occurrences: [2]f64 = .{ std.math.floatMax(f64), 0 };
        var ages: [2]f64 = .{ std.math.floatMax(f64), 0 };

        for (word_list.items[0..@min(5, word_list.items.len)]) |word| {
            next_page: for (0..word.pages_len) |i| {
                if (index.map.get(&word.pages[i].hash)) |page| {
                    if (findResult(&results.items, page)) |_| continue :next_page;

                    const new_age: f64 = @floatFromInt(
                        getAge(@intFromPtr(page.href.ptr), page.href.len),
                    );
                    const new_occurrences: f64 = @floatFromInt(word.pages[i].occurrences);

                    occurrences[0] = @min(occurrences[0], new_occurrences);
                    occurrences[1] = @max(occurrences[1], new_occurrences);
                    ages[0] = @min(ages[0], new_age);
                    ages[1] = @max(ages[1], new_age);

                    results.append(allocator, Result{
                        .page = page,
                        .distance = word_map.get(word).?,
                        .occurrences = new_occurrences,
                        .age = new_age,
                    }) catch |err| {
                        panic(err, "results alloc");
                    };
                } else {
                    panic(error.NotFound, "word missing from index");
                }
            }
        }

        // Normalize values between 0 and 1
        // Adjust scoring with recency bias
        for (results.items) |*r| {
            r.occurrences = 1 - ((r.occurrences - occurrences[0]) /
                (occurrences[1] - occurrences[0]));
            r.age = (r.age - ages[0]) /
                (ages[1] - ages[0]);
            r.occurrences *= 0.5;
            r.age *= 1.25;
            r.score = @floatFromInt(r.distance);
            r.score += r.occurrences;
            r.score += r.age;
        }

        // Update existing links
        for (results.items) |result| {
            if (findResult(&links.items, result.page)) |link| {
                link.score = @min(link.score, 0);
                link.score += result.score;
            } else {
                links.append(allocator, result) catch |err| {
                    panic(err, "links alloc");
                };
            }
        }
    }

    // Final sort order by score
    std.mem.sort(Result, links.items, {}, struct {
        fn lessThanFn(_: void, lhs: Result, rhs: Result) bool {
            return lhs.score < rhs.score;
        }
    }.lessThanFn);

    formatSearch(&links);
}

/// Post JSON back to web worker
fn formatSearch(links: *std.ArrayListUnmanaged(Result)) void {
    var i: usize = 0;
    scratch[0] = '[';
    if (links.items.len == 0) {
        scratch[1] = ']';
        setSearch(@intFromPtr(scratch.ptr), 2);
        return;
    }
    for (links.items[0..@min(10, links.items.len)]) |r| {
        i += 1; // Account for opening '[' or previous ','
        scratch[i] = '[';
        inline for (0..3) |j| {
            i += 1; // Account for opening '[' or previous ','
            scratch[i] = '"';
            i += 1;
            switch (j) {
                0 => {
                    @memcpy(scratch[i..], &std.fmt.bytesToHex(r.page.hash, .lower));
                    i += r.page.hash.len * 2;
                },
                1 => {
                    @memcpy(scratch[i..], r.page.href);
                    i += r.page.href.len;
                },
                2 => {
                    @memcpy(scratch[i..], r.page.title);
                    i += r.page.title.len;
                },
                else => unreachable,
            }
            @memcpy(scratch[i..], "\",");
            i += 1;
        }
        @memcpy(scratch[i..], "],");
        i += 1;
    }
    scratch[i] = ']';
    setSearch(@intFromPtr(scratch.ptr), i + 1);
}

/// Return pointer to the scratch buffer offset
export fn getScratch() [*]const u8 {
    return @ptrCast(scratch);
}

/// Search comma separated string in the scratch buffer
export fn getSearch(len: usize) void {
    if (len < 3) return;
    if (len > scratch_len) return;
    var words: std.ArrayListUnmanaged([]const u8) = .empty;
    defer words.deinit(wasm_allocator);
    var iter = std.mem.splitScalar(u8, scratch[0..len], ',');
    while (iter.next()) |w| {
        words.append(wasm_allocator, w) catch |err| {
            panic(err, "search alloc");
        };
    }
    search(words.items) catch |err| {
        panic(err, "search");
    };
}

export fn init() void {
    // Parse embedded JSON
    const word_count = std.mem.readInt(u32, file[0..4], .little);
    var i: usize = 4;
    for (0..word_count) |_| {
        const word_len: usize = file[i];
        i += 1;
        const word = Word{
            .word = file[i .. i + word_len],
            .pages_len = std.mem.readInt(u16, file[i + word_len ..][0..2], .little),
            .pages = @ptrCast(@alignCast(file[i + word_len + 2 ..][0..5])),
        };
        index.words.append(
            wasm_allocator,
            word,
        ) catch |err| panic(err, "alloc");
        i += (word.pages_len * 5) + word_len + 2;
    }
    const page_count = std.mem.readInt(u32, file[i..][0..4], .little);

    i += 4;
    for (0..page_count) |_| {
        const hash = file[i..][0..4];
        i += 4;
        const href = file[i + 1 .. i + 1 + file[i]];
        i += href.len + 1;
        const title = file[i + 1 .. i + 1 + file[i]];
        i += title.len + 1;
        const page = wasm_allocator.create(Page) catch |err| {
            panic(err, "init parse page");
        };
        page.* = .{
            .hash = hash,
            .href = href,
            .title = title,
        };
        index.pages.append(wasm_allocator, page) catch |err| {
            panic(err, "init page alloc");
        };
        index.map.put(wasm_allocator, hash, page) catch |err| {
            panic(err, "init map alloc");
        };
    }

    // Buffer for input
    scratch = wasm_allocator.alloc(u8, scratch_len) catch |err| {
        panic(err, "scratch alloc");
    };

    // Debug console
    print("Index: {d}", .{index.words.items.len});
    print("Pages: {d}", .{index.pages.items.len});
}
