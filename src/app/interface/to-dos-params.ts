import { ToDos } from "./to-dos";

export interface ToDosParams {
    limit: number,
    skip: number,
    total: number,
    todos: ToDos[]
}
