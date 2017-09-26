class Meal {
    constructor(name, likes = 0, dislikes = 0) {
        this.name = name
        this.likes = likes
        this.dislikes = dislikes
    }

    like() {
        this.likes++
    }

    dislike() {
        this.dislikes++
    }

    get ratio() {
        return this.likes / this.dislikes
    }

    persist() {
        // firebase(normalize(this.name), likes, dislikes)
    }
}

export default Meal
