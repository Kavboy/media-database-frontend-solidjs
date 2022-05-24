/**
 * Function that returns class for corresponding fsk rating
 * @param ageRating
 * @returns {string}
 */
const getFSKClass = (ageRating: string): string => {
  let fskClass: string;

  switch (ageRating) {
    case '6':
      fskClass = 'mdb-fsk6';
      break;
    case '12':
      fskClass = 'mdb-fsk12';
      break;
    case '16':
      fskClass = 'mdb-fsk16';
      break;
    case '18':
      fskClass = 'mdb-fsk18';
      break;
    default:
      fskClass = 'mdb-fsk0';
  }

  return fskClass;
}

/**
 * Creates poster source from posterpath
 * @param tmdbID
 * @param posterPath
 * @param size
 * @returns {string}
 */
const getPosterSRC = (tmdbID: string, posterPath: string, size?: string): string => {
  let imgSrc: string;
  if (tmdbID && !posterPath.includes('base64') && !posterPath.includes('storage')) {
    imgSrc = `https://www.themoviedb.org/t/p/${size ? size : 'w185'}${posterPath}`;
  } else {
    imgSrc = posterPath;
  }

  return imgSrc

}

/**
 * English to German genre mapping
 */
const genresGerman = {
  "action": "Aktion",
  "adventure": "Abenteuer",
  "animation": "Animation",
  "comedy": "Komödie",
  "crime": "Krimi",
  "documentary": "Dokumentation",
  "drama": "Drama",
  "family": "Familie",
  "fantasy": "Fantasy",
  "history": "Historisch",
  "horror": "Horror",
  "music": "Musik",
  "mystery": "Mystery",
  "romance": "Romantik",
  "science-fiction": "Science Fiction",
  "tv-movie": "TV Film",
  "thriller": "Thriller",
  "war": "Krieg",
  "western": "Western",
  "kids": "Kinder",
  "news": "News",
  "reality": "Reality",
  "soap": "Soap",
  "talk": "Talk",
  "politics": "Politik"
}

/**
 * Converts genre array to displayable string
 * @param genres
 * @returns {*} String
 */
 const genreDisplay = (genres: Array<string>) => {
  return genres.map(genre => genresGerman[genre]).join(', ');
}

export {
  getFSKClass,
  getPosterSRC,
  genreDisplay,
  genresGerman
}