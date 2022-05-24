import Joi from 'joi';

/**
 * Function to handle checkbox checked unchecked and adding or removing values from
 * corresponding array in data
 * @param name Array name
 * @param value The checkbox value
 * @param data Data that contains the array for the checkbox values
 * @param setData Function to set the data state
 */
const handleCheckBoxes = (name: string, value: string, data: object, setData: Function) => {
  let temp = [...data[name]];
  if (data[name].includes(value)) {
    temp = data[name].filter(el => el !== value);
  } else {
    temp.push(value);
  }

  setData({
    ...data,
    [name]: temp,
  });
};

/**
 * Function to validate data with Joi schema
 * @param data Media data to be validated
 * @returns {Joi.ValidationError}
 */
const validateData = (data: object) => {
  const schema = Joi.object({
    type: Joi.string().pattern(/(Movie|TV)/).required(),
    title: Joi.string().required(),
    release_date: Joi.date().required(),
    poster_path: Joi.string().allow('').pattern(/\/(.)+\.(jpg)/).optional(),
    overview: Joi.string().allow('').optional(),
    youtube_link: Joi.string().allow('').pattern(/^https:\/\/www?\.?youtube\.com\/watch\?v=[a-zA-Z\d\-_&=]+$/).optional(),
    age_rating: Joi.string().pattern(/(0|6|12|16|18)/).required(),
    location: Joi.string().allow('').optional(),
    mediums: Joi.array().min(1).required(),
    genres: Joi.array().min(1).required(),
    seasons: Joi.array().optional(),
  }).unknown(true);

  const { error } = schema.validate(data, {
    abortEarly: false,
    dateFormat: 'date',
    errors: { label: 'key' },
  });

  return error;

};

/**
 * Function to get the video key from a youtube link
 * @param link Complete link https://www.youtube.de/watch?v=kjsficw34r
 * @returns {string}
 */
const getKeyFromYoutubeLink = (link: string) => {
  return link.substring(link.indexOf('=') + 1, link.length);
};

export {
  handleCheckBoxes,
  validateData,
  getKeyFromYoutubeLink
};