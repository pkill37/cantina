class Food {
    constructor(name) {
        this.name = name
        this.likes = 0 
        this.dislikes = 0 
    }

    like() {
        this.likes++
    }

    dislike() {
        this.dislikes++
    }

    persist() {
        // firebase(normalize(this.name), likes, dislikes)
    }
}

export default Food 
