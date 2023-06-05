class NewtonsCradle {
  constructor(xx, yy, number, size, length) {
    this.xx = xx;
    this.yy = yy;
    this.number = number;
    this.size = size;
    this.length = length;

    // create engine
    this.engine = Matter.Engine.create();
    this.world = this.engine.world;

    // create renderer
    this.render = Matter.Render.create({
      element: document.getElementById("main"),
      engine: this.engine,
      options: {
        width: 800,
        height: 600,
        showVelocity: true,
        wireframes: false,
      },
    });

    // create runner
    this.runner = Matter.Runner.create();

    // add mouse control
    this.mouse = Matter.Mouse.create(this.render.canvas);
    this.mouseConstraint = Matter.MouseConstraint.create(this.engine, {
      mouse: this.mouse,
      constraint: {
        stiffness: 0.2,
        render: {
          visible: false,
        },
      },
    });

    // fit the render viewport to the scene
    Matter.Render.lookAt(this.render, {
      min: { x: 0, y: 50 },
      max: { x: 800, y: 600 },
    });
  }

  create() {
    // run the renderer
    Matter.Render.run(this.render);

    // run the engine
    Matter.Runner.run(this.runner, this.engine);

    // create newton's cradle
    this.newtonsCradle = Matter.Composite.create({ label: "Newtons Cradle" });

    for (var i = 0; i < this.number; i++) {
      var separation = 1.9,
        circle = Matter.Bodies.circle(
          this.xx + i * (this.size * separation),
          this.yy + this.length,
          this.size,
          {
            inertia: Infinity,
            restitution: 1,
            friction: 0,
            frictionAir: 0,
            slop: this.size * 0.02,
          }
        ),
        constraint = Matter.Constraint.create({
          pointA: { x: this.xx + i * (this.size * separation), y: this.yy },
          bodyB: circle,
        });

      Matter.Composite.addBody(this.newtonsCradle, circle);
      Matter.Composite.addConstraint(this.newtonsCradle, constraint);
    }

    // add newton's cradle to world
    Matter.Composite.add(this.world, this.newtonsCradle);

    // translate the first body in the cradle
    Matter.Body.translate(this.newtonsCradle.bodies[0], { x: -190, y: -100 });

    // add mouse constraint to world
    Matter.Composite.add(this.world, this.mouseConstraint);

    // keep the mouse in sync with rendering
    this.render.mouse = this.mouse;

    // return the necessary properties
    return {
      engine: this.engine,
      runner: this.runner,
      render: this.render,
      canvas: this.render.canvas,
      stop: () => {
        Matter.Render.stop(this.render);
        Matter.Runner.stop(this.runner);
      },
    };
  }
}

// create instance of NewtonsCradle and call create method
const newtonsCradle = new NewtonsCradle(280, 220, 5, 30, 200);
newtonsCradle.create();
