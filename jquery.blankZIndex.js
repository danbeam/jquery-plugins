/*
 * File: jquery.blankZIndex.js
 * Version: 1.0.0 (Feb. 17, 2010)
 * Copyright (C) 2010 Dan Beam
 * Licensed under the GPLv3 License: http://www.opensource.org/licenses/gpl-3.0.html
 * Requires: jQuery v1.2 or later?
 * Description: Return parents of given set that have no z-index
 */
(
	function( $ )
	{
		if( "undefined" === typeof window.console )
		{
			window.console = { "log": function( ){ } };
		}
		if( "undefined" === typeof $.fn.blankZIndex )
		{
			$.fn.blankZIndex = function( selector )
			{
				var blank = [ ];
			
				this.each( function( )
				{
					var $orig = $temp = $( this );
	
					do
					{
						if( $temp.css( 'z-index' ) === 'auto' )
						{
							for( var i = 0, len = blank.length; i < len; ++i )
							{
								if( blank[ i ] === $temp[ 0 ] ){ break; }
							}
							if( i >= len ){ blank.push( $temp[ 0 ] ); }
						}
						$temp = $temp.parent( );
					}
					while( ! /body/i.test( $temp[ 0 ].nodeName ) );
				} );

				return $( blank );
			};
		}
	}
)( jQuery );
