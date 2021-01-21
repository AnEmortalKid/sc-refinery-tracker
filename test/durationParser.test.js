import { toDurationString, toSeconds } from "../src/durationParser";

describe("toSeconds", () => {
  test("format: Xs", () => {
    expect(toSeconds("59s")).toBe(59);
  });

  test("format: Xm Xs", () => {
    expect(toSeconds("5m 5s")).toBe(305);
  });

  test("format: Xh Xm Xs", () => {
    var hours = 2 * 60 * 60;
    var mins = 10 * 60;
    var secs = 12;
    expect(toSeconds("2h 10m 12s")).toBe(hours + mins + secs);
  });

  test("format: Xd Xh Xm Xs", () => {
    var days = 3 * 24 * 60 * 60;
    var hours = 2 * 60 * 60;
    var mins = 10 * 60;
    var secs = 12;
    expect(toSeconds("3d 2h 10m 12s")).toBe(days + hours + mins + secs);
  });
});

describe("toDurationString", () => {
  test("< 0", () => {
    expect(toDurationString(-1)).toBe("");
  });
  test("0", () => {
    expect(toDurationString(0)).toBe("");
  });
  test("seconds only", () => {
    var seconds = 25;
    expect(toDurationString(seconds)).toBe("25s");
  });

  test("seconds under 60", () => {
    var seconds = 59;
    expect(toDurationString(seconds)).toBe("59s");
  });
  test("60s becomes 1m", () => {
    var seconds = 60;
    expect(toDurationString(seconds)).toBe("1m");
  });
  test("minutes under 60", () => {
    var seconds = 59 * 60;
    expect(toDurationString(seconds)).toBe("59m");
  });

  test("59m 59s", () => {
    var seconds = 59 * 60 + 59;
    expect(toDurationString(seconds)).toBe("59m 59s");
  });

  test("1 hour", () => {
    var seconds = 60 * 60;
    expect(toDurationString(seconds)).toBe("1h");
  });

  test("1 hour 59m 59s", () => {
    var seconds = 1 * 60 * 60 + 59 * 60 + 59;
    expect(toDurationString(seconds)).toBe("1h 59m 59s");
  });

  test("3 hours", () => {
    var seconds = 3 * 60 * 60;
    expect(toDurationString(seconds)).toBe("3h");
  });

  test("23h 59m 59s", () => {
    var seconds = 23 * 60 * 60 + 59 * 60 + 59;
    expect(toDurationString(seconds)).toBe("23h 59m 59s");
  });

  test("24h becomes 1d", () => {
    var seconds = 24 * 60 * 60;
    expect(toDurationString(seconds)).toBe("1d");
  });

  test("over a day", () => {
    var seconds = 25 * 60 * 60;
    expect(toDurationString(seconds)).toBe("1d 1h");
  });

  test("under 2 days", () => {
    var seconds = 48 * 60 * 60 - 1;
    expect(toDurationString(seconds)).toBe("1d 23h 59m 59s");
  });
});
