class CoreGraph {

  private nodes: GraphNode[];
  private edges: Edge[];

  public get Nodes(): GraphNode[] {
    return this.nodes.slice();
  }

  public get Edges(): Edge[] {
    return this.edges.slice();
  }

  constructor(ids: string[]) {
    this.nodes = new Array<GraphNode>();
    this.edges = new Array<Edge>();

    this.addNodes(ids);
  }

  public addNodes(ids : string[]) : void {
    ids.forEach(element => {
      this.getOrAddNode(element);
    });
  }

  public getOrAddNode(id: string) : GraphNode {
    var existing = this.getNode(id);

    if (existing !== undefined) {
      return existing;
    }

    var node = {
      id: id,
      isStart: false,
      isEnd: false
    };

    this.nodes.push(node);

    return node;
  }

  public getNode(id: string): GraphNode {
    return this.find(id);
  }

  public linkNodes(start: string, end: string, distance: number) : void {
    var startNode = this.getOrAddNode(start);
    var endNode = this.getOrAddNode(end);

    this.edges.push({
      origin: startNode,
      destination: endNode,
      distance: distance
    });
  }

  public setStart(id: string) : void {
    var start = this.find(id);

    if (start !== undefined) {
      start.isStart = true;
    }
  }

  public setEnd(id: string) : void {
    var end = this.find(id);

    if (end !== undefined) {
      end.isEnd = true;
    }
  }

  public calculatePath(depthFirst : boolean): [string[], string[][]] {
    var queue = new Array<string[]>();
    queue[0] = [this.getStart().id];

    var log = queue.slice();
    var extended = new Array<string>();

    var result = undefined;
    while (result === undefined) {
      result = this.calculatePathInternal(depthFirst, queue, log, extended);
    }

    return [result, log];
  }

  private calculatePathInternal(depthFirst: boolean, queue: Array<string[]>,
    log: Array<string[]>,
    extended: Array<string>): string[] {
    var current = queue.shift();

    var currentEndNode = current[current.length - 1];

    extended.push(currentEndNode);

    var locations = this.getAttachedNodes(currentEndNode);

    for (var i = 0; i < locations.length; i++) {
      var location = locations[i];

      var newPath = current.slice();
      newPath.push(location.destination.id);

      if (location.destination.isEnd) {
        return newPath;
      }

      log.push(newPath);

      if (depthFirst){
        queue.push(newPath);
      } else {
        queue.unshift(newPath);
      }
    }

    return undefined;
  }

  private getAttachedNodes(id: string): Edge[] {
    var edges = this.edges.filter(x => {
      return x.origin.id == id;
    });

    return edges;
  }

  private getStart(): GraphNode {
    for(var i = 0; i < this.nodes.length; i++){
      if (this.nodes[i].isStart){
        return this.nodes[i];
      }
    }

    return undefined;
  }

  private find(id: string): GraphNode {
    for(var i = 0; i < this.nodes.length; i++){
      if (this.nodes[i].id == id){
        return this.nodes[i];
      }
    }

    return undefined;
  }
}