<?php
/**
 * The base configuration for WordPress
 *
 * The wp-config.php creation script uses this file during the installation.
 * You don't have to use the web site, you can copy this file to "wp-config.php"
 * and fill in the values.
 *
 * This file contains the following configurations:
 *
 * * Database settings
 * * Secret keys
 * * Database table prefix
 * * ABSPATH
 *
 * @link https://wordpress.org/support/article/editing-wp-config-php/
 *
 * @package WordPress
 */

// ** Database settings - You can get this info from your web host ** //
/** The name of the database for WordPress */
define( 'DB_NAME', 'bennywebsite_db' );

/** Database username */
define( 'DB_USER', 'root' );

/** Database password */
define( 'DB_PASSWORD', '' );

/** Database hostname */
define( 'DB_HOST', 'localhost' );

/** Database charset to use in creating database tables. */
define( 'DB_CHARSET', 'utf8mb4' );

/** The database collate type. Don't change this if in doubt. */
define( 'DB_COLLATE', '' );

/**#@+
 * Authentication unique keys and salts.
 *
 * Change these to different unique phrases! You can generate these using
 * the {@link https://api.wordpress.org/secret-key/1.1/salt/ WordPress.org secret-key service}.
 *
 * You can change these at any point in time to invalidate all existing cookies.
 * This will force all users to have to log in again.
 *
 * @since 2.6.0
 */
define( 'AUTH_KEY',         'Gpan []-~ZVJU`;J}HOn{w_,BQdbj(l^r!8l<>dLN%c1_)6ZMvaa;%;i]8-nu~b<' );
define( 'SECURE_AUTH_KEY',  'yc=D,7#*C6y uDe*pE<>@*+a(rL Llpo9vN3-EU;6NT+nu<pshMe7b[YQvFAGUO@' );
define( 'LOGGED_IN_KEY',    'W5w;-]x;/:5G1r,7u@Sv+N73i!U?9F U7bMDp1yKa+^|skYp`>:/;BY Gx/IhR2o' );
define( 'NONCE_KEY',        '_YK0)-usHL):uP?1;rhh*}m`&viF/oL})>R=ox<S3zRne#kO^E]a[WV|R%;!-P`e' );
define( 'AUTH_SALT',        'xZ6bB`!,nRT<V,_u)d7tKtD*=!6;:?yr3@VOWJ<)PA+P]|94b95u?TGx?+~{kc}*' );
define( 'SECURE_AUTH_SALT', '%M?b[O1jmNlOI4:7byG/$WHQX`@rXynIRKdi0n*$iHsA~Tw95Qy4;9pMs`qjw^4>' );
define( 'LOGGED_IN_SALT',   'O}!ASczDz9Y}4n&i*C(p&sG<w>w:aUn5gJ~bJLAx@>ULv2g*MS{)|<G8!qcPPp|d' );
define( 'NONCE_SALT',       '-yf29lWr5?~`5pf[<a{I:hq<FV2u>qKJ$p81{OH@gXC9aVDNUyQ;v]*A$:S<ciMW' );

/**#@-*/

/**
 * WordPress database table prefix.
 *
 * You can have multiple installations in one database if you give each
 * a unique prefix. Only numbers, letters, and underscores please!
 */
$table_prefix = 'wp_';

/**
 * For developers: WordPress debugging mode.
 *
 * Change this to true to enable the display of notices during development.
 * It is strongly recommended that plugin and theme developers use WP_DEBUG
 * in their development environments.
 *
 * For information on other constants that can be used for debugging,
 * visit the documentation.
 *
 * @link https://wordpress.org/support/article/debugging-in-wordpress/
 */
define( 'WP_DEBUG', false );

/* Add any custom values between this line and the "stop editing" line. */



/* That's all, stop editing! Happy publishing. */

/** Absolute path to the WordPress directory. */
if ( ! defined( 'ABSPATH' ) ) {
	define( 'ABSPATH', __DIR__ . '/' );
}

/** Sets up WordPress vars and included files. */
require_once ABSPATH . 'wp-settings.php';
