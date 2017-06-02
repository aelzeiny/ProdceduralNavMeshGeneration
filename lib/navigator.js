import * as COLORS from './utils/colors';

class Navigator {
  constructor(clipperMap, mesh) {
    this.clipperMap = clipperMap;
    this.mesh = mesh;
  }

  mousemove(pt) {
    if(this.clipperMap.contains(pt)) {
      if(this.goal)
        this.mesh.removeNode(this.goal);
      //add node
      this.goal = this.mesh.addNode(pt);
      // connect node to entire map
      const cm = this.clipperMap;
      const verts = this.mesh.getVerts();
      for(let i=0;i<verts.length;i++) {
        if(cm.inLineOfSight(verts[i].value, pt)) {
          this.mesh.connectNodes(verts[i], this.goal);
        }
      }
    }
  }

  update(delta) {

  }

  draw(ctx) {
    const verts = this.mesh.getVerts();

    ctx.beginPath();
    ctx.strokeStyle = COLORS.NODE_CONNECTION;
    ctx.lineWidth = .4;
    for(let i=0;i<this.verts.length;i++) {
      const from = this.verts[i];
      for(let j=0;j<from.neighbors.length;j++) {
        ctx.moveTo(from.X, from.Y);
        ctx.lineTo(from.neighbors[i].X, from.neighbors[i].Y);
      }
    }
    ctx.stroke();

    for(let i=0;i<verts.length;i++) {
      const v = verts[i];
      ctx.beginPath();
      ctx.arc(v.value.X, v.value.Y, 4, 0, 2 * Math.PI, false);
      ctx.fill();
      ctx.stroke();
    }
  }
}

export default Navigator;