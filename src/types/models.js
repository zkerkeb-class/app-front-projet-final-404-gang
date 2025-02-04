/**
 * @typedef {Object} Artist
 * @property {string} _id
 * @property {string} name
 * @property {string} genre
 * @property {number} popularity
 * @property {Array<string>} albums
 * @property {Array<string>} tracks
 */

/**
 * @typedef {Object} Album
 * @property {string} _id
 * @property {string} title
 * @property {string} artist
 * @property {string} genre
 * @property {Date} releaseDate
 * @property {Array<string>} tracks
 * @property {Object} images
 * @property {string} images.original
 * @property {string} images.thumbnail
 * @property {string} images.small
 * @property {string} images.medium
 * @property {string} images.large
 */

/**
 * @typedef {Object} Track
 * @property {string} _id
 * @property {string} title
 * @property {number} duration
 * @property {string} artist
 * @property {string} album
 * @property {string} genre
 * @property {number} popularity
 * @property {string} audioUrl
 * @property {Object} images
 * @property {string} images.original
 * @property {string} images.thumbnail
 * @property {string} images.small
 * @property {string} images.medium
 * @property {string} images.large
 */

/**
 * @typedef {Object} Playlist
 * @property {string} _id
 * @property {string} name
 * @property {string} description
 * @property {Array<string>} tracks
 * @property {string} createdBy
 */ 