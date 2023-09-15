#!/bin/bash

curl -fsSL https://deno.land/x/install/install.sh | sh

export PATH="$HOME/.deno/bin:$PATH"

deno task --cwd src/deno build

exit 0
