export function breakLongString(value: string, every = 12) {
  if (value.includes(" ")) {
    return value;
  }

  return value.replace(new RegExp(`(.{${every}})`, "g"), "$1\n");
}
