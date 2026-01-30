export function breakLongString(value: string, every = 10) {
  return value.replace(new RegExp(`(.{${every}})`, "g"), "$1 ");
}
