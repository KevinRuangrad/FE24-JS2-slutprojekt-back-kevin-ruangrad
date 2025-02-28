import fs from "fs/promises";
// Sökväg från rotmappen
const path = './src/movies.json';
export async function getAllMovies() {
    const rawMovies = await fs.readFile(path, 'utf-8');
    const movies = JSON.parse(rawMovies);
    return movies;
}
export async function getMovie(year) {
    const movies = await getAllMovies();
    const filteredMovies = movies.filter(movie => movie.year === year);
    return filteredMovies;
}
export async function addMovie(movie) {
    const movies = await getAllMovies();
    movies.push(movie);
    await fs.writeFile(path, JSON.stringify(movies, null, 2));
    return `${movie.name} added.`;
}
