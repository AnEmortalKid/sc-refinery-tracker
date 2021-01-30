import { readFileSync } from 'fs'
import {resolve} from 'path';

const filePath = resolve(__dirname, "..", "..", "src", "views", "users", "usersView.html");
const usersView = readFileSync(filePath,  {encoding:'utf8', flag:'r'});

test("foo", () => {
    console.log(usersView);
});