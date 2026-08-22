/**
 * permissions.js
 * Client-side permission query functions for role-based UI rendering.
 */

export const ROLES = {
  HOST: 'HOST',
  MODERATOR: 'MODERATOR',
  PARTICIPANT: 'PARTICIPANT',
};

/**
 * Checks if the user role can control video playback (Play, Pause, Seek)
 * @param {string} role
 * @returns {boolean}
 */
export function canControlPlayback(role) {
  return role === ROLES.HOST || role === ROLES.MODERATOR;
}

/**
 * Checks if the user role can change the YouTube video
 * @param {string} role
 * @returns {boolean}
 */
export function canChangeVideo(role) {
  return role === ROLES.HOST || role === ROLES.MODERATOR;
}

/**
 * Checks if the user role can manage participant roles or kick users
 * @param {string} role
 * @returns {boolean}
 */
export function canManageUsers(role) {
  return role === ROLES.HOST;
}

/**
 * Checks if user is Host
 * @param {string} role
 * @returns {boolean}
 */
export function isHost(role) {
  return role === ROLES.HOST;
}
