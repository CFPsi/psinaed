(function ($) {
	
	$(function(){
		var $window = $(window);
		PrimeMoverBackups.initialize();
		PrimeMoverBackups.deleteBackups();	
		PrimeMoverBackups.copyURLToClipBoard();
		PrimeMoverBackups.cleanUpUrlAfterBackupRefresh();
		PrimeMoverBackups.warnFreeBackupRestoration();
		PrimeMoverBackups.checkWidth($window);
		PrimeMoverBackups.narrowScreens($window);		
		PrimeMoverBackups.handleClickNote();	
		PrimeMoverBackups.handleCancelNote();
		PrimeMoverBackups.handleSaveNote();
		PrimeMoverBackups.handleInputFocus();	
    });
		
    var PrimeMoverBackups = {
				
    	/**
    	 * Mobile responsive checks on backup menu screen.
    	 */
        narrowScreens: function($window) {
        	$window.resize(function() {
        		PrimeMoverBackups.checkWidth($window);
        	});
        },
        /**
         * Backup menu icons responsive check
         */
        checkWidth: function($window) {
		        var windowsize = $window.width();		        
		        if (windowsize > 768 && windowsize < 1280 ) {		        		        	
		        	$('.js-prime-mover-download-button-backup').html('<span class="dashicons dashicons-download"></span>');
		        	$('.js-prime-mover-restore-icon').html('<span class="dashicons dashicons-backup"></span>');
		        	$('.js-prime-mover-clipboard-button-responsive').html('<span class="dashicons dashicons-migrate"></span>');
		        	$('.js-prime-mover-upgrade-button-simple').html('<span class="dashicons dashicons-cart prime-mover-cart-dashicon"></span>');
		        } else {	        	
		        	$('.js-prime-mover-download-button-backup').html(prime_mover_js_backups_renderer.download_text);
		        	$('.js-prime-mover-restore-icon').html(prime_mover_js_backups_renderer.restore_package_text);
		        	$('.js-prime-mover-clipboard-button-responsive').html(prime_mover_js_backups_renderer.copy_restore_url);
		        	$('.js-prime-mover-upgrade-button-simple').html(prime_mover_js_backups_renderer.upgradetoprotext);
		        }
		},
		/**
		 * Clean up URL after backup refresh
		 */
    	cleanUpUrlAfterBackupRefresh: function() {
    		$(window).load(function () {
    			if (PrimeMoverBackups.maybeCleanUpUrl()) {    				
        		    window.history.replaceState({}, "Title", prime_mover_js_backups_renderer.backup_menu_url);   				
    			}    			  
    		});
    	},
    	/**
    	 * Maybe clean up URL
    	 */
    	maybeCleanUpUrl: function() {
    		var field = 'prime_mover_refresh_backups';
    		var url = window.location.href;
    		if(url.indexOf('?' + field + '=') != -1)
    		    return true;
    		else if(url.indexOf('&' + field + '=') != -1)
    		    return true;
    		return false  		
    	},
    	/**
    	* Initialize
    	*/
        initialize: function() {
        	$('body').on('click','.js-prime-mover-clear-site', function(e){     			
    		    $('.js-prime-mover-site-selector').val('');	         	
    		});  
        	
        	$(".js-prime-mover-site-selector").change(function() {
        		   $(this).closest("form").submit();
            });
        },
		
		/**
		 * Handle click event on Note feature
		 */
		handleClickNote: function() {                    
		    var i18n = window.prime_mover_js_backups_renderer || {};
		    var isPro = i18n.is_pro !== undefined ? i18n.is_pro : true;
		    var upgradeUrl = i18n.notes_upgrade || '#';
		    var upgradeTitle = i18n.notes_upgrade_title || 'Activate or upgrade your license to save notes for this backup/migration package';

		    // Conditional width: 100% when licensed, 80% when unlicensed (Free/Deactivated)
		    var boxWidth = isPro ? '100%' : '80%';

		    $('body').on('click', '.prime-mover-add-note-btn, td.package_notes.column-package_notes .prime-mover-package-notes', function(e) {
		         e.stopPropagation();
		                
		         var $cellDiv = $(this).closest('.prime-mover-package-notes');
		         if ($cellDiv.find('.prime-mover-note-input-wrap').length > 0) {
		             return;
		         }
		                
		         var isPlaceholder = $(this).hasClass('prime-mover-add-note-btn') || $(this).find('.prime-mover-add-note-btn').length > 0;
		         var currentText = isPlaceholder ? '' : $cellDiv.clone().children().remove().end().text().trim();
		            
		         $cellDiv.data('original-html', $cellDiv.html());
		         
		         // Build action buttons with the dynamic title attribute included for unlicensed states
		         var actionButtonsHtml = '';
		         if (isPro) {
		             actionButtonsHtml = '<button type="button" class="button button-small button-primary prime-mover-save-note">' + (i18n.save_text || 'Save') + '</button>';
		         } else {
		             actionButtonsHtml = '<a href="' + upgradeUrl + '" title="' + PrimeMoverBackups.escapeHtml(upgradeTitle) + '" class="button button-small button-primary prime-mover-upgrade-btn" style="background: #29abe1; border-color: #29abe1; color: #fff; text-decoration: none; display: inline-block; line-height: 2; padding: 0 8px; white-space: nowrap; font-size: 11px;">' + (i18n.upgrade_to_save_text || 'Upgrade') + '</a>';
		         }

		         // Apply dynamic boxWidth and structure
		         var editHtml = '<div class="prime-mover-note-input-wrap" style="margin-top: 4px;">' +
		             '<textarea class="prime-mover-note-input large-text" maxlength="80" rows="2" placeholder="" style="width: ' + boxWidth + '; min-height: 45px; margin-bottom: 6px; font-size: 13px; line-height: 1.4; padding: 6px; resize: vertical; box-sizing: border-box;"></textarea>' +
		             '<div style="display: flex; flex-direction: column; gap: 6px; width: ' + boxWidth + '; box-sizing: border-box;">' +
		                 '<div>' +
		                     '<span class="prime-mover-char-counter" style="font-size: 11px; color: #646970; white-space: nowrap;">' + (i18n.chars_max_text || '80 chars max') + '</span>' +
		                 '</div>' +
		                 '<div style="display: flex; gap: 4px; justify-content: flex-start; align-items: center;">' +
		                     actionButtonsHtml +
		                     '<button type="button" class="button button-small prime-mover-cancel-note" style="padding: 0 6px; white-space: nowrap;">' + (i18n.cancelbutton || 'Cancel') + '</button>' +
		                 '</div>' +
		             '</div>' +
		         '</div>';

		         $cellDiv.html(editHtml);
		         $cellDiv.find('.prime-mover-note-input').attr('placeholder', i18n.backupnotes_placeholder || 'Add a note (max 80 chars)...');
		                
		         var $input = $cellDiv.find('.prime-mover-note-input');
		         var $counter = $cellDiv.find('.prime-mover-char-counter');
		                
		         $input.val(currentText).focus();
		         var val = $input.val();
		         $input.val('').val(val);
		         PrimeMoverBackups.updateCounter($input, $counter);
		                
		         $input.on('input', function() {
		             var $currCounter = $cellDiv.find('.prime-mover-char-counter');
		             if ($currCounter.hasClass('prime-mover-status-msg')) {
		                 $currCounter.removeClass('prime-mover-status-msg').css('color', '#646970');
		             }
		             PrimeMoverBackups.updateCounter($(this), $currCounter);
		         });
		    });                        
		},

		/**
		 * Update counter
		 */
		updateCounter: function($input, $counter) {
		    var i18n = window.prime_mover_js_backups_renderer || {};
		    var leftText = i18n.left_text || 'left';
		    var currentLength = $input.val().length;
		    $counter.css('white-space', 'nowrap').text((80 - currentLength) + ' ' + leftText);       
		},
		
		/**
		 * Cancel note entry
		 */
		handleCancelNote: function() {
			// Handle Cancel action (revert back to original view)
			$('body').on('click', '.prime-mover-cancel-note', function(e) {
			    e.stopPropagation();
			    var $cellDiv = $(this).closest('.prime-mover-package-notes');
			    var originalHtml = $cellDiv.data('original-html');
			    if (originalHtml) {
			        $cellDiv.html(originalHtml);
			    }
			});
		},

		/**
		 * Handle AJAX Save Note Action
		 */
		handleSaveNote: function() {
		    var i18n = window.prime_mover_js_backups_renderer || {};
		    var savingText = i18n.saving_text || 'Saving...';
		    var savedText = i18n.saved_text || 'Note saved successfully!';
		    var errorText = i18n.error_text || 'Failed to save note.';

		    $('body').on('click', '.prime-mover-save-note', function(e) {
		        e.stopPropagation();
		        var $cellDiv = $(this).closest('.prime-mover-package-notes');
		        var $input = $cellDiv.find('.prime-mover-note-input');
		        var $counterArea = $cellDiv.find('.prime-mover-char-counter');
		        var noteText = $input.val().trim();
		        var packageId = $cellDiv.data('packageId') || '';
				var blogId = $cellDiv.data('blogId') || '';

		        // Replace counter with WordPress native spinner + saving label
		        $counterArea.replaceWith(
		            '<span class="prime-mover-char-counter prime-mover-status-msg" style="font-size: 11px; color: #646970; white-space: nowrap; display: inline-flex; align-items: center; gap: 4px;">' +
		            '<span class="spinner is-active" style="float: none; margin: 0; width: 16px; height: 16px;"></span> ' +
		            savingText +
		            '</span>'
		        );

		        // Send AJAX request to WordPress backend
		        $.post(ajaxurl, {
		            action: 'prime_mover_save_package_note',
		            package_id: packageId,
					blog_id: blogId,
		            note: noteText,
		            nonce: i18n.nonce || ''
		        })
		        .done(function(response) {
		            var $status = $cellDiv.find('.prime-mover-char-counter');
		            if (response && response.success) {
		                $status.css('color', '#008710').text(savedText);
		                
		                // Update stored original HTML so clicking cancel later retains the saved note view
		                var displayHtml = noteText === '' ? 
		                    '<button type="button" class="button-link prime-mover-add-note-btn"><span class="dashicons dashicons-edit prime-mover-add-note-icon"></span><span class="prime-mover-add-note-text">' + (i18n.add_note_text || 'Add note') + '</span></button>' : 
		                    PrimeMoverBackups.escapeHtml(noteText) + ' <span class="dashicons dashicons-edit prime-mover-edit-icon" title="Edit note" style="font-size: 14px; width: 14px; height: 14px; color: #a7aaad; vertical-align: middle; margin-left: 4px;"></span>';
		                $cellDiv.data('original-html', displayHtml);
		            } else {
		                var errMsg = (response && response.data && response.data.message) ? response.data.message : errorText;
		                $status.css('color', '#d63638').text(errMsg);
		            }
		        })
		        .fail(function() {
		            var $status = $cellDiv.find('.prime-mover-char-counter');
		            $status.css('color', '#d63638').text(errorText);
		        });
		    });
		},
		
		/**
		 * Bring back live counter when clicking/focusing textarea after save
		 */
		handleInputFocus: function() {
		    $('body').on('focus click', '.prime-mover-note-input', function() {
		        var $cellDiv = $(this).closest('.prime-mover-package-notes');
		        var $status = $cellDiv.find('.prime-mover-char-counter');
		        
		        if ($status.hasClass('prime-mover-status-msg') && !$status.find('.spinner').length) {
		            $status.removeClass('prime-mover-status-msg').css('color', '#646970');
		            PrimeMoverBackups.updateCounter($(this), $status);
		        }
		    });
		},				
		/**
		 * Escape HTML
		 */
		escapeHtml: function(text) {
			var map = {
			            '&': '&amp;',
			            '<': '&lt;',
			            '>': '&gt;',
			            '"': '&quot;',
			            "'": '&#039;'
			        };
			return text.replace(/[&<>"']/g, function(m) { return map[m]; });		
		},	
        /**
    	 * Delete backups handler
    	 */
    	deleteBackups: function() {
    		var deleteZipFileselector = '#doaction, #doaction2';    		
    		$('body').on('click',deleteZipFileselector, function(e){     			
    			var deleteval = $('#bulk-action-selector-top').val();
    			if ('-1' === deleteval) {
    				deleteval = $('#bulk-action-selector-bottom').val();
    			}
                if ( 'delete' !== deleteval) {
                	return;
                }                
                if ( 0 === $("input[name='prime_mover_backup[]']:checkbox:checked").length) {
                   return;
                }                
                e.preventDefault();                
    			var dialog_selector = "#js-prime-mover-confirm-backups-delete";
    			var msg = prime_mover_js_backups_renderer.deleteBackupFileWarning;    			
    			
            	$(dialog_selector + " span").html(msg);           	
            	PrimeMoverBackups.showDeleteDialog(dialog_selector);            	
    		});    		
    	},
        /**
         * Warn free backup restoration
         */
        warnFreeBackupRestoration: function() {
        	var warnFreeBackupRestoreselector = '.js-prime-mover-restore-free-backups';    		
    		$('body').on('click',warnFreeBackupRestoreselector, function(e){     			 
                e.preventDefault();    			
    			   			
    			var target_uri = $(this).attr('href');    
    			if ('readonly' === prime_mover_js_backups_renderer.prime_mover_config_writable) {
    				var dialog_selector = "#js-prime-mover-block-free-restore-cached-enabled";
    				PrimeMoverBackups.showCachingEnabledErrorRestoreDialog(dialog_selector); 
    			} else {
    				var dialog_selector = "#js-prime-mover-confirm-backups-free-restore";
    				PrimeMoverBackups.showFreeBackupRestoreDialog(dialog_selector, target_uri);      
    			}            	      	
    		});           	
        }, 
        /**
    	 * Show restore warning on free plan
    	 */
    	showCachingEnabledErrorRestoreDialog: function(dialog_selector) { 
    		$(dialog_selector).dialog({
	            resizable: false,
	            height: "auto",	            
	            minWidth: 320,
	            dialogClass: 'prime-mover-user-dialog',
	            maxWidth: 600,
	            modal: true,
	            fluid: true,
				buttons: [
				    {
				      text: prime_mover_js_backups_renderer.cancelbutton,
				      "class" : "button-primary",
				      click: function() {				    	  					    	  
				    	  $( this ).dialog( "close" );				    	  
					  }
				    }				    
				 ],
				 open: function( event, ui ) {							
						$('.prime-mover-user-dialog button').blur();	    	 
			     },
	          });
            PrimeMoverBackups.handle_responsive_dialog();   		
    	},        
    	/**
    	 * Show restore warning on free plan
    	 */
    	showFreeBackupRestoreDialog: function(dialog_selector, target_uri) {
    		var warnFreeBackupRestoreselector = '.js-prime-mover-restore-free-backups';  
    		$(dialog_selector).dialog({
	            resizable: false,
	            height: "auto",	            
	            minWidth: 320,
	            dialogClass: 'prime-mover-user-dialog',
	            maxWidth: 600,
	            modal: true,
	            fluid: true,
				buttons: [
				    {
				      text: prime_mover_js_backups_renderer.freerestorebutton,	
				      "class" : "button-primary",
				      click: function() {				    	  					    	  
				    	  window.location = target_uri;				    	  
					  }
				    },
				    {
					 text: prime_mover_js_backups_renderer.cancelbutton,					 
					 click: function() {							 
						 $( this ).dialog( "close" );						 
					 }
					},				    
				 ],
				 open: function( event, ui ) {							
						$('.prime-mover-user-dialog button').blur();	    	 
			     },
	          });
            PrimeMoverBackups.handle_responsive_dialog();   		
    	},
    	/**
    	 * Delete dialog handler
    	 */
    	showDeleteDialog: function(dialog_selector) {                           			
            $(dialog_selector).dialog({
	            resizable: false,
	            height: "auto",	            
	            minWidth: 320,
	            dialogClass: 'prime-mover-user-dialog',
	            maxWidth: 600,
	            modal: true,
	            fluid: true,
				buttons: [
				    {
				      text: prime_mover_js_backups_renderer.deletebutton,
				      "class": "button button-primary",
				      click: function() {				    	  	
				    	  $('#prime_mover_backups-filter').submit();
					  }
				    },
				    {
					 text: prime_mover_js_backups_renderer.cancelbutton,					 
					 click: function() {							 
						 $( this ).dialog( "close" );						 
					 }
					},				    
				 ],
				 open: function( event, ui ) {							
					 $('.prime-mover-user-dialog button').blur();	    	 
			     },
	          });
            PrimeMoverBackups.handle_responsive_dialog();
    	},
    	/**
		 * Fluid Dialog handler
		 */
		fluidDialog: function() {            
			var $visible = $(".ui-dialog:visible");        	    
			$visible.each(function () {
				var $this = $(this);
				var dialog = $this.find(".ui-dialog-content").data("ui-dialog");        	        
				if (dialog.options.fluid) {
					var wWidth = $(window).width();        	            
					if (wWidth < (parseInt(dialog.options.maxWidth) + 50))  {        	                
						$this.css("max-width", "90%");
					} else {        	        	
						var adjusted_width = 0.9 * parseInt(dialog.options.maxWidth);                	
						$this.css("max-width", adjusted_width + "px");
					}        	            
					dialog.option("position", dialog.options.position);
				}
			});       	
		},
		/**
		 * Copy to clipboard
		 */
		copyURLToClipBoard: function() {
    		var clipboard = new ClipboardJS('.js-prime-mover-copy-clipboard-menu');    		
    		
    		clipboard.on('success', function(e) {
    			var target_id = $(e.trigger).attr('data-clipboard-id'); 
    			$('#' + target_id).fadeIn('fast').delay(3000).fadeOut();
    		});
    	},
		/**
		 * Handle responsive dialog
		 */
		handle_responsive_dialog: function() {
			$(window).resize(function () {
				PrimeMoverBackups.fluidDialog();
			});
			PrimeMoverBackups.fluidDialog();        	
		}		
    };
}(jQuery));
