import rl from "readline";

const spin_char = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];

let spin_count = 0;
export function spin() {
  process.stdout.write("\x1B[?25l");
  rl.clearLine(process.stdout, 0);
  rl.moveCursor(process.stdout, -9999, 0);
  process.stdout.write(spin_char[spin_count]);
  spin_count++;
  if (spin_count >= spin_char.length) spin_count = 0
}
