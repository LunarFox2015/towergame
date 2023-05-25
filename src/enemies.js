const ENEMIES = [
    {
        id: 0,
        name: 'null',
        health: 0,
        speed: 0,
        value: 0,
        tex: {
            left: 0,
            top: 0,
            height: 0,
            width: 0,
        }
    },
    {
        id: 1,
        name: 'ghost',
        health: 100,
        armor: 0,
        speed: 20/60,
        value: 5,
        tex: {
            left: 40,
            top: 0,
            height: 20,
            width: 20,
        }
    },
    {
        id: 2,
        name: 'skull',
        health: 100,
        armor: 0,
        speed: 200/60,
        value: 10,
        tex: {
            left: 40,
            top: 20,
            width: 40,
            height: 20,
        }
    },
    {
        id: 3,
        name: 'rat',
        health: 1,
        armor: 0,
        speed: 40/60,
        value: 1,
        tex: {
            left: 60,
            top: 0,
            height: 20,
            width: 20,
        }
    },
    {
        id: 4,
        name: 'slime',
        health: 400,
        armor: 10,
        speed: 20/60,
        value: 20,
        tex: {
            left: 80,
            top: 0,
            height: 40,
            width: 40,
        }
    }
];