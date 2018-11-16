;(function (root, factory) {

	/* CommonJS */
	if (typeof module == 'object' && module.exports) module.exports = factory()

	/* AMD module */
	else if (typeof define == 'function' && define.amd) define(factory)

	/* Browser global */
	else root.MobileSwitch = factory()
}
(this, function () {
	"use strict"
	var MobileSwitch = {};
	MobileSwitch.themeColor = "rgb(7, 223, 245)";
	MobileSwitch.init = function(ele) {
		var s = "<span class='slider'></span>";
		$("[class^=switch]").append(s);
		$("[class^=switch]").click(function() {
			if ($(ele).hasClass("switch-disabled")) {
				return;
			}
			if ($(ele).hasClass("switch-on")) {
				$(ele).removeClass("switch-on").addClass("switch-off");
				$(".switch-off").css({
					'border-color' : '#dfdfdf',
					'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
					'background-color' : 'rgb(223, 223, 223)'
				});
			} else {
				$(ele).removeClass("switch-off").addClass("switch-on");
				if (MobileSwitch.themeColor) {
					var c = MobileSwitch.themeColor;
					$(ele).css({
						'border-color' : c,
						'box-shadow' : c + ' 0px 0px 0px 16px inset',
						'background-color' : c
					});
				}
				if ($(ele).attr('themeColor')) {
					var c2 = $(ele).attr('themeColor');
					$(ele).css({
						'border-color' : c2,
						'box-shadow' : c2 + ' 0px 0px 0px 16px inset',
						'background-color' : c2
					});
				}
			}
		});
		window.switchEvent = function(ele, on, off) {
			$(ele).click(function() {
				if ($(this).hasClass("switch-disabled")) {
					return;
				}
				if ($(this).hasClass('switch-on')) {
					if ( typeof on == 'function') {
						on();
					}
				} else {
					if ( typeof off == 'function') {
						off();
					}
				}
			});
		}
		if (this.themeColor) {
			var c = this.themeColor;
			$(".switch-on").css({
				'border-color' : c,
				'box-shadow' : c + ' 0px 0px 0px 16px inset',
				'background-color' : c
			});
			$(".switch-off").css({
				'border-color' : '#dfdfdf',
				'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
				'background-color' : 'rgb(223, 223, 223)'
			});
		}
		if ($('[themeColor]').length > 0) {
			$('[themeColor]').each(function() {
				var c = $(this).attr('themeColor') || MobileSwitch.themeColor;
				if ($(this).hasClass("switch-on")) {
					$(this).css({
						'border-color' : c,
						'box-shadow' : c + ' 0px 0px 0px 16px inset',
						'background-color' : c
					});
				} else {
					$(".switch-off").css({
						'border-color' : '#dfdfdf',
						'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
						'background-color' : 'rgb(223, 223, 223)'
					});
				}
			});
		}
	};
	MobileSwitch.showOn = function(ele) {
		$(ele).removeClass("switch-off").addClass("switch-on");
		if(MobileSwitch.themeColor){
			var c = MobileSwitch.themeColor;
			$(ele).css({
				'border-color' : c,
				'box-shadow' : c + ' 0px 0px 0px 16px inset',
				'background-color' : c
			});
		}
		if ($(ele).attr('themeColor')) {
			var c2 = $(ele).attr('themeColor');
			$(ele).css({
				'border-color' : c2,
				'box-shadow' : c2 + ' 0px 0px 0px 16px inset',
				'background-color' : c2
			});
		}
	}
	MobileSwitch.showOff = function(ele) {
		$(ele).removeClass("switch-on").addClass("switch-off");
		$(".switch-off").css({
			'border-color' : '#dfdfdf',
			'box-shadow' : 'rgb(223, 223, 223) 0px 0px 0px 0px inset',
			'background-color' : 'rgb(223, 223, 223)'
		});
	};

	return MobileSwitch;

}));
