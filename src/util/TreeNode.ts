import {EntryNode} from '../component/FileList/data';

class PathNode<T> {
  data?: T;
  children: Map<string, PathNode<T>> = new Map();

  add(path: string, data: T) {
    const parts = path.split('/');

    // Directory
    if (parts[parts.length - 1] === '') {
      parts.pop();
    }

    let cur: PathNode<T> = this;
    for (const part of parts) {
      if (!cur.children.has(part)) {
        cur.children.set(part, new PathNode());
      }
      cur = cur.children.get(part)!;
    }
    cur.data = data;
  }

  trim(check: (data: T) => boolean) {
    const toDelete = [];
    for (const [key, child] of this.children.entries()) {
      if (!child.data || !check(child.data)) toDelete.push(key);
      else child.trim(check);
    }
    toDelete.forEach(k => this.children.delete(k));
  }

  sort(by: (a: T, b: T) => number) {
    this.children = new Map<string, PathNode<T>>(
      [...this.children].sort((a, b) => {
        return by(a[1].data!, b[1].data!);
      })
    );
    this.children.forEach(child => child.sort(by));
  }

  // SAFETY: Must be trimmed before shrank
  shrink(merge: (parentData: T, childData: T) => boolean) {
    while (this.children.size === 1) {
      let key = this.children.keys().next().value;
      const child = this.children.get(key)!;
      const ready = merge(this.data!, child.data!);
      if (ready) {
        this.children = child.children;
      } else {
        break;
      }
    }
    for (const child of this.children.values()) {
      child.shrink(merge);
    }
  }

  layeredIter(f: (node: PathNode<T>) => void) {
    const stack: PathNode<T>[] = [this];
    while (stack.length) {
      const cur = stack.pop()!;
      f(cur);
      cur.children.forEach(value => {
        stack.push(value);
      });
    }
  }

}

export default PathNode;
