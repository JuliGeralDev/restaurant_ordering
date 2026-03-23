const { spawn } = require("child_process");

const npmCommand = process.platform === "win32" ? "npm.cmd" : "npm";

function runProcess(name, args, color) {
  const child = spawn(npmCommand, args, {
    stdio: "pipe",
    shell: false,
  });

  child.stdout.on("data", (data) => {
    process.stdout.write(`${color}[${name}] ${data}\x1b[0m`);
  });

  child.stderr.on("data", (data) => {
    process.stderr.write(`${color}[${name}] ${data}\x1b[0m`);
  });

  child.on("exit", (code) => {
    if (code !== 0) {
      process.stderr.write(`\x1b[31m[${name}] exited with code ${code}\x1b[0m\n`);
    }
  });

  return child;
}

const backend = runProcess(
  "backend",
  ["run", "dev", "--prefix", "./restaurant_ordering_backend"],
  "\x1b[36m"
);

const frontend = runProcess(
  "frontend",
  ["run", "dev", "--prefix", "./restaurant_ordering_front"],
  "\x1b[35m"
);

function shutdown() {
  backend.kill();
  frontend.kill();
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
