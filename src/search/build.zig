const std = @import("std");

pub fn build(b: *std.Build) void {
    const target = b.resolveTargetQuery(.{
        .cpu_arch = .wasm32,
        .os_tag = .freestanding,
    });

    const exe = b.addExecutable(.{
        .name = "search",
        .root_source_file = b.path("search.zig"),
        .target = target,
        .optimize = .ReleaseSmall,
    });

    exe.entry = .disabled;
    exe.rdynamic = true;
    exe.import_memory = true;
    exe.stack_size = std.wasm.page_size;
    exe.initial_memory = (10 * 1024 * 1024);
    exe.max_memory = (50 * 1024 * 1024);

    b.installArtifact(exe);
}
