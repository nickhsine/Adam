import { gql } from '@apollo/client'

/**
 * @typedef {Object} ImageFile
 * @property {number} width
 * @property {number} height
 */

/**
 * @typedef {Object} Resized
 * @property {string} original
 * @property {string} w480
 * @property {string} w800
 * @property {string} w1200
 * @property {string} w1600
 * @property {string} w2400
 */

/**
 * @typedef {Object} Photo
 * @property {string} id
 * @property {string} name
 * @property {ImageFile} imageFile
 * @property {Resized} resized
 */

export const heroImage = gql`
  fragment heroImage on Photo {
    imageFile {
      width
      height
    }
    resized {
      original
      w480
      w800
      w1200
      w1600
      w2400
    }
  }
`
