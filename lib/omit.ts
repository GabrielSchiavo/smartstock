// Utilitário para remover propriedades de objetos
export function omit<T, K extends keyof T>(obj: T, ...keys: K[]): Omit<T, K> {
  const copy: T = { ...obj };
  for (const k of keys) {
    delete copy[k];
  }
  return copy as Omit<T, K>;
}

// Exemplo
// const obj = { a: 1, b: 2, c: 3 };
// const newObj = omit(obj, 'a', 'c');
// console.log(newObj); // -> { b: 2 }