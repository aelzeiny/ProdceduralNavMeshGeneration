import Main from './lib/main';

/**** DOCUMENT *****/
document.addEventListener("DOMContentLoaded", function() {
  const canvasEl = document.getElementsByTagName("canvas")[0];
  const resize = () => {
    canvasEl.width = window.innerWidth - 30;
    canvasEl.height = window.innerHeight - 30;
  };
  resize();
  window.addEventListener("resize", resize);

  const views = new Array(5);
  for(let i=1;i<=views.length;i++) {
    views[i-1] = document.getElementById("step-" + i);
  }

  const main = new Main(canvasEl, views);

  // Control events
  document.getElementById("percentWalls").addEventListener("change", e => main.wallsPercent(e.currentTarget.value));
  document.getElementById("percentWalls").addEventListener("input", e => main.wallsPercent(e.currentTarget.value));
  document.getElementById("regenAutoma").addEventListener("click", (e) => main.regenAutoma());
  document.getElementById("clipperPlus").addEventListener("click", (e) => main.polygonClip(true));
  document.getElementById("clipperMinus").addEventListener("click", (e) => main.polygonClip(false));


  // Step Flow Events
  document.getElementById("next-1").addEventListener("click", (e) => main.next(1));
  document.getElementById("next-2").addEventListener("click", (e) => main.next(2));
  document.getElementById("next-3").addEventListener("click", (e) => main.next(3));
  document.getElementById("reset").addEventListener("click", (e) => main.next(-1));



  // Mouse sensory events
  window.addEventListener("keydown", (e) => main.keyDown(e.keyCode), true);
  window.addEventListener("keyup", (e) => main.keyUp(e.keyCode), true);
  window.addEventListener("mousemove", main.mousemove.bind(main));
  window.addEventListener("mousedown", main.mousedown.bind(main));
  window.addEventListener("mouseup", main.mouseup.bind(main));
  window.addEventListener("mousewheel", main.mousewheel.bind(main));
  window.addEventListener("DOMMouseScroll", main.mousewheel.bind(main));
  window.addEventListener("resize", main.setSize.bind(main));
  main.start();
});
