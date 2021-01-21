/**
 * @jest-environment jsdom
 */
import Controls from "../../src/controls/controls";

const controls = new Controls();
test("closeModal", () => {
  var created = document.createElement("div");
  created.setAttribute("id", "closable");
  document.body.appendChild(created);

  controls.closeModal("closable");

  expect(created.style.display).toBe("none");
});

test("openModal", () => {
  var created = document.createElement("div");
  created.setAttribute("id", "closable");
  document.body.appendChild(created);

  controls.openModal("closable");

  expect(created.style.display).toBe("block");
});
