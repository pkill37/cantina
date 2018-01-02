class Food {
    constructor(name) {
        this.name = name
        this.likes = 0 
        this.dislikes = 0 
    }

    like() {
        console.log('HEY!!!!!!!!!!')
        this.likes++
        console.log('NOW', this.likes)
    }

    dislike() {
        this.dislikes++
    }

    persist() {
        // firebase(normalize(this.name), likes, dislikes)
    }
}

export default Food 
