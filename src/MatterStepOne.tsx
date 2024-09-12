import React, { useEffect, useRef } from 'react';
import Matter from 'matter-js';

const MatterComponent: React.FC = () => {
  const scene = useRef<HTMLDivElement>(null); // Reference for the div that will hold the canvas
  const engineRef = useRef<Matter.Engine | null>(null); // To store the engine instance

  useEffect(() => {
    // Module aliases
    const { Engine, Render, Runner, Bodies, Composite, Mouse, MouseConstraint } = Matter;

    // Create an engine
    const engine = Engine.create();
    engineRef.current = engine;

    // Create a renderer
    const render = Render.create({
      element: scene.current as HTMLElement,
      engine: engine,
      options: {
        width: 800,
        height: 600,
        wireframes: false, // Set to true if you want a wireframe display
      },
    });

    // Create two draggable boxes and a ground
    const boxA = Bodies.rectangle(400, 200, 80, 120);
    const boxB = Bodies.rectangle(450, 50, 80, 80);
    const ground = Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

    // Add all of the bodies to the world
    Composite.add(engine.world, [boxA, boxB, ground]);

    // Create a mouse instance and a mouse constraint
    const mouse = Mouse.create(render.canvas);
    const mouseConstraint = MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: {
        stiffness: 0.2, // The stiffness of the constraint when dragging
        render: {
          visible: false, // Set to true if you want to see the drag constraint
        },
      },
    });

    // Add the mouse constraint to the world
    Composite.add(engine.world, mouseConstraint);

    // Keep the mouse in sync with rendering
    render.mouse = mouse;

    // Run the renderer
    Render.run(render);

    // Create and run the runner
    const runner = Runner.create();
    Runner.run(runner, engine);

    // Cleanup function to stop the engine and remove canvas
    return () => {
      Render.stop(render);
      Runner.stop(runner);
      if (engineRef.current) {
        Matter.World.clear(engineRef.current.world, false);
        Matter.Engine.clear(engineRef.current);
      }
      render.canvas.remove();
      render.textures = {};
    };
  }, []);

  return <div ref={scene} />; // Div where Matter.js will inject the canvas
};

export default MatterComponent;
