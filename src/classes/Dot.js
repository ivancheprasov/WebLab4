export class Dot {
    #x;
    #y;
    #r;
    #isDefined=true;
    #hit;
    constructor(x,y,r) {
        this.#x=x;
        this.#y=y;
        this.#r=r;
        if(x===undefined||y===undefined||r===undefined){
            this.#isDefined=false;
            this.#x='';
            this.#y='';
            this.#r='';
        }
        this.calculateHit();
    }
    getX(){
        return this.#x;
    }
    getY(){
        return this.#y;
    }
    getR(){
        return this.#r;
    }
    getHit(){
        return this.#hit;
    }
    calculateHit(){
        if(this.#isDefined){
            this.#hit=(
                ((this.#x>=0&&this.#y>=0)&&(this.#y<=-this.#x+(this.#r/2)))||
                ((this.#x<0&&this.#y>=0)&&(Math.pow(this.#x,2)+Math.pow(this.#y,2)<=Math.pow(this.#r/2,2)))||
                ((this.#x<0&&this.#y<0)&&(this.#x>=(-this.#r/2)&&this.#y>=-this.#r))
            );
        }else{
            this.#hit='';
        }
    }
}