export class Test
{
    x: number;
    y: number;
    label: string;
    do: string;

    constructor(name: string, xCoordinate: number, yCoordinate: number) {
        this.label = name;
        this.x = xCoordinate;
        this.y = yCoordinate;
        this.do = "Yoo";
    }
}