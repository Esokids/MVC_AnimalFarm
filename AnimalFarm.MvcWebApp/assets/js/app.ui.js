var app = {
    messages: {
        ajax: {
            "loading": "Please wait while data is loading.."
        },
        validators: {
            "required": "{0} is required.",
            "dateMustNotGreaterThanTo": "Date from must be less than or equal date to"
        },
        confirmation: {
            "proceedButtonText": "PROCEED",
            "cancelButtonText": "CANCEL"
        },
        dataSource: {
            "requestEnd": {
                "readSuccess": "request data is successfully.",
                "readNoRecord": "Data not found.",
                "updateSuccess": "The data was {0} successfully.",
                "createSuccess": "The data was {0} successfully.",
                "destroySuccess": "The data was deleted successfully."
            },
            "noRecordFound": "No data from search result.",
        },
        grid: {
            popupEditor: {
                create: {
                    title: 'New',
                    button: { text: "Save" }
                },
                edit: {
                    title: 'Edit',
                    button: { text: "Save" }
                },
                cancelButton: {
                    text: "Cancel"
                }
            }
        },
        sessionTimeout: {
            title: "Your session is about to expire!",
            message: "Your session is about to expire.",
            countdownMessage: 'Redirecting in {timer} seconds.'
        },
        upload: {
            cancel: "Cancel",
            clearSelectedFiles: "Clear",
            remove: "Remove",
            select: "Select"
        },
        "scrollToTop": "Scroll to top"
    },
    data: {
        toDateString: function (date) {
            return date ? date.toISOString() : null;
        },
        getFieldValue: function (items, value, name) {
            name = name || "Name";
            var item = $.grep(items, function (n, i) { return n.Value === value; });
            return item.length > 0 ? item[0][name] : "";
        },
        dateDiff: function (date1, date2) {
            var timeDiff = date1.getTime() - date2.getTime();
            return Math.ceil(timeDiff / (1000 * 3600 * 24));
        },
        replaceAt: function (string, index, replace) {
            return string.substring(0, index) + replace + string.substring(index + 1);
        }
    },
    ui: {
        getRequiredMessage: function (input) {
            var field = input.data("field");
            if (field)
                return kendo.format(app.messages.validators.required, field);
            return app.messages.validators.required;
        },
        preventKeyEventInPage: function () {
            var selector = $("body");
            selector.on('keypress', function (e) {
                e = e || window.event;
                var key = e.keyCode;
                var srcElement = e.target || e.srcElement;
                var cancelEvent = !(srcElement.type === "submit" || srcElement.type === "button" || srcElement.tagName.toLocaleLowerCase() === "textarea");

                if (key === 13) {
                    e.returnValue = !cancelEvent;
                    e.cancelBubble = cancelEvent;
                    if (cancelEvent) { e.preventDefault(); }
                    return !cancelEvent;
                }
                return true;
            });

            selector.on('keydown', function (e) {
                e = e || window.event;
                var key = e.keyCode;
                var srcElement = e.target || e.srcElement;
                var cancelEvent = (srcElement.type === "submit" || srcElement.type === "button" || (srcElement.type === "text" && srcElement.readOnly));

                if (key === 8) {
                    e.returnValue = !cancelEvent;
                    e.cancelBubble = cancelEvent;
                    if (cancelEvent) { e.preventDefault(); }
                    return !cancelEvent;
                }
                return true;
            });
        },
        initAjax: function () {
            var notification = $("#ajax-notifications").kendoNotification({
                position: {
                    pinned: true,
                    bottom: 40,
                    right: 20
                },
                animation: {
                    open: {
                        effects: "fadeIn"
                    },
                    close: {
                        effects: "fadeOut"
                    }
                },
                width: 400,
                autoHideAfter: 0,
                stacking: "down",
                templates: [
                    {
                        type: "progress",
                        template: "<div class=\"k-notification-container\">" +
                            "<div class=\"content\"><i class=\"fa fa-spinner fa-spin\"></i> #= message #</div>" +
                            "</div>"
                    }
                ]
            }).data("kendoNotification");

            $(document).ajaxStart(function () {
                notification.show({ message: app.messages.ajax.loading }, "progress");
            }).ajaxStop(function () {
                notification.hide();
            });
        },
        clear: function (target, container) {
            var elems = [];
            if (!$.isArray(target)) {
                elems.push(target);
            } else {
                elems = $.merge([], target);
            }

            $.each(target, function (index, elem) {
                var w = container == undefined ? $(elem) : $(elem, container);

                if (w.length > 0 && w[0].tagName === "SPAN") {
                    w.text("");
                }


                var t = w.data("kendoGrid");
                if (t) {
                    // Append no data template
                    t.tbody.append("<tr class=\"k-no-data\"><td colspan=\"" + t.columns.length + "\"></td></tr>");
                    $(".k-grid-content-expander", elem).remove();

                    // clear filter and sorting                    
                    t.dataSource.filter({});
                    t.dataSource.sort({});
                    t.dataSource.data([]);
                    t.refresh();
                    return;
                }

                t = w.data("kendoAutoComplete");
                if (t) {
                    var v = t.value();
                    t.value('');
                    if (v !== '') {
                        t.trigger("change");
                    }
                    return;
                }

                t = w.data("kendoMultiSelect");
                if (t) { t.value([]); return; }

                t = w.data("kendoDropDownList");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        if (t.value() != d) {
                            t.value(d);
                            t.trigger("select");
                        }
                    } else {
                        t.select(0);
                        t.trigger("select");
                    }
                    return;
                }

                t = w.data("kendoNumericTextBox");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        if (t.value() !== d) {
                            t.value(d);
                            t.trigger("change");
                        }
                    } else {
                        t.value('');
                    }
                    return;
                }

                t = w.data("kendoDatePicker");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        var v = kendo.parseDate(d, t.options.parseFormats);
                        if (v !== t.value()) {
                            t.value(v);
                            t.trigger("change");
                        }
                    } else {
                        t.value(null);
                    }
                    return;
                }

                t = w.data("kendoDateTimePicker");
                if (t) {
                    var d = $(t.element).data("default");
                    if (typeof d !== "undefined") {
                        var v = kendo.parseDate(d, t.options.parseFormats);
                        if (v !== t.value()) {
                            t.value(v);
                            t.trigger("change");
                        }
                    } else {
                        t.value(null);
                    }
                    return;
                }

                t = w.data("kendoTextBox");
                if (t) { t.value(''); return; }

                if (w.is("[type=checkbox]")) {
                    var doChecked = w.is("[data-default-checked]");
                    if (doChecked)
                        w.prop("checked", true);
                    else
                        w.prop("checked", false);
                    return;
                }

                if (w.is("[type=radio]")) {
                    var doChecked = w.is("[data-default-checked]");
                    if (doChecked)
                        w.prop("checked", true);
                    else
                        w.prop("checked", false);
                    return;
                }
                w.val('');
            });
        },
        handleDatePickerChange: function (selector) {
            selector = selector || "[data-role='datepicker']";
            $(selector).bind("change", function (e) {
                var datePicker = $(this).data("kendoDatePicker");
                if (datePicker) {
                    var raiseEvent = false;
                    var v = kendo.parseDate($(this).val(), datePicker.options.format);
                    if (v) {
                        if (datePicker.value() !== v) {
                            raiseEvent = true;
                        }
                        datePicker.value(v);
                    } else {
                        if (datePicker.value() !== v) {
                            raiseEvent = true;
                        }
                        datePicker.value(null);
                    }
                    if (raiseEvent) { datePicker.trigger("change"); }
                }
            });
        },
        datePickerRelate: function (datepickerFrom, datepickerTo, allowNull) {
            allowNull = allowNull === undefined ? true : allowNull;
            datepickerFrom.bind("change", function (e) {
                if (allowNull && (this.value() === null || datepickerTo.value() === null)) { return; }
                if (this.value() > datepickerTo.value()) {
                    if (datepickerTo.value() !== this.value()) {
                        datepickerTo.value(this.value());
                        datepickerTo.trigger("change");
                    }
                }

            });
            datepickerTo.bind("change", function (e) {
                if (allowNull && (this.value() === null || datepickerFrom.value() === null)) { return; }
                if (this.value() < datepickerFrom.value()) {
                    if (datepickerFrom.value() !== this.value()) {
                        datepickerFrom.value(this.value());
                        datepickerFrom.trigger("change");
                    }
                }
            });
        },
        numericTextBoxRelate: function (numericFrom, numericTo, allowNull) {
            allowNull = allowNull || true;
            numericFrom.bind("change", function (e) {
                if (allowNull && (this.value() === null || numericTo.value() === null)) { return; }
                if (this.value() > numericTo.value()) {
                    if (numericTo.value() !== this.value()) {
                        numericTo.value(this.value());
                        numericTo.trigger("change");
                    }
                }

            });
            numericTo.bind("change", function (e) {
                if (allowNull && (this.value() === null || numericFrom.value() === null)) { return; }
                if (this.value() < numericFrom.value()) {
                    if (numericFrom.value() !== this.value()) {
                        numericFrom.value(this.value());
                        numericFrom.trigger("change");
                    }
                }
            });
        },
        dataSourceRead: function (ds) {
            ds.data([]);
            ds.page(1);
        },
        handleDataSourceRequestEnd: function (e, options) {
            var settings = $.extend(true, {
                create: {
                    icon: 'glyphicon glyphicon-info-sign',
                    message: kendo.format(app.messages.dataSource.requestEnd.createSuccess, e.type),
                    delay: 3000,
                    type: 'success',
                    enable: true,
                    read: {
                        enable: true,
                        data: {}
                    }
                },
                update: {
                    icon: 'glyphicon glyphicon-info-sign',
                    message: kendo.format(app.messages.dataSource.requestEnd.updateSuccess, e.type),
                    delay: 3000,
                    type: 'success',
                    enable: true,
                    read: {
                        enable: true,
                        data: {}
                    }
                },
                destroy: {
                    icon: 'glyphicon glyphicon-info-sign',
                    message: kendo.format(app.messages.dataSource.requestEnd.destroySuccess, e.type),
                    delay: 3000,
                    type: 'success',
                    enable: true,
                    read: {
                        enable: true,
                        data: {}
                    }
                },
                read: {
                    icon: 'glyphicon glyphicon-info-sign',
                    message: kendo.format(app.messages.dataSource.requestEnd.readSuccess, e.type),
                    delay: 3000,
                    type: 'success',
                    enable: false,
                    empty: {
                        icon: 'glyphicon glyphicon-info-sign',
                        message: app.messages.dataSource.requestEnd.readNoRecord,
                        delay: 3000,
                        type: 'warning',
                        enable: true
                    }
                }
            }, options || {});

            if (typeof e.type !== "undefined") {
                switch (e.type) {
                    case "create":
                        var message = e.response.message !== undefined ? e.response.message : settings.create.message;
                        if (settings.create.enable === true) {
                            $.notify({
                                icon: settings.create.icon,
                                message: message
                            }, {
                                // settings
                                delay: settings.create.delay,
                                type: settings.create.type
                            });
                        }

                        if (settings.create.read.enable === true) {
                            e.sender.read(settings.create.read.data);
                        }
                        return { handled: true, message: message };
                    case "update":
                        var message = e.response.message !== undefined ? e.response.message : settings.update.message;
                        if (settings.update.enable === true) {
                            $.notify({
                                icon: settings.update.icon,
                                message: message
                            }, {
                                    // settings
                                    delay: settings.update.delay,
                                    type: settings.update.type
                                });
                        }

                        if (settings.update.read.enable === true) {
                            e.sender.read(settings.update.read.data);
                        }
                        return { handled: true, message: message };
                    case "destroy":
                        var message = e.response.message !== undefined ? e.response.message : settings.destroy.message;
                        if (settings.destroy.enable === true) {
                            $.notify({
                                icon: settings.destroy.icon,
                                message: message
                            }, {
                                    // settings
                                    delay: settings.destroy.delay,
                                    type: settings.destroy.type
                                });
                        }

                        if (settings.destroy.read.enable === true) {
                            e.sender.read(settings.destroy.read.data);
                        }
                        return { handled: true, message: message };
                    case "read":
                        if (e.response !== undefined && e.response.Data !== undefined) {
                            if (e.response.Data.length === 0) {
                                if (settings.read.empty.enable === true) {
                                    $.notify({
                                        icon: settings.read.empty.icon,
                                        message: settings.read.empty.message
                                    }, {
                                            // settings
                                            delay: settings.read.empty.delay,
                                            type: settings.read.empty.type
                                        });
                                }
                                return { handled: true, message: settings.read.empty.message };
                            } else {
                                if (settings.read.enable === true) {
                                    $.notify({
                                        icon: settings.read.icon,
                                        message: settings.read.message
                                    }, {
                                            // settings
                                            delay: settings.read.delay,
                                            type: settings.read.type
                                        });
                                }
                                return { handled: true, message: settings.read.message };
                            }
                        }
                }
            }
            return { handled: false };
        },
        handleDataSourceError: function (e) {
            if (e.status === "error") {
                var message = e.xhr.responseJSON !== undefined ? e.xhr.responseJSON.message : e.xhr.statusText;
                var isSessionTimeOut = e.xhr.responseJSON !== undefined ? (e.xhr.responseJSON.sessiontimeOut !== undefined ? e.xhr.responseJSON.sessiontimeOut : false) : false;
                $.notify({
                    // options
                    icon: 'glyphicon glyphicon-exclamation-sign',
                    message: message
                }, {
                        // settings
                        delay: 3000,
                        type: 'danger'
                    });

                if (isSessionTimeOut === true) {
                    window.location = "/";
                }
                return { handled: true, message: message };
            }
            return { handled: false };
        },
        handleGridDataSourceError: function (e, grid) {
            if (e.status === "error") {
                var message = e.xhr.responseJSON !== undefined ? e.xhr.responseJSON.message : e.xhr.statusText;
                var operation = e.xhr.responseJSON !== undefined ? e.xhr.responseJSON.operation : '';
                $.notify({
                    // options
                    icon: 'glyphicon glyphicon-exclamation-sign',
                    message: message
                }, {
                        // settings
                        delay: 3000,
                        type: 'danger'
                    });

                if (operation === 'destroy' || operation === "delete") {
                    grid.cancelChanges();
                }

                if (operation === 'update' || operation === "edit") {
                    e.preventDefault();
                }
                return { handled: true, message: message };
            }
            return { handled: false };
        },
        handleGridPopupEditError: function (e, grid, message, selector) {
            if (e.status === "error") {
                var message = e.xhr.responseJSON !== undefined ? e.xhr.responseJSON.message : e.xhr.statusText;
                selector = selector || '#editor-error-container';
                grid.one("dataBinding", function (ev) {
                    ev.preventDefault();   // cancel grid rebind if error occurs                   
                });
                $(selector, grid.editable.element).html(message);
                return { handled: true, message: message };
            }
            return { handled: false };
        },
        getResponseMessage: function (xhr, data) {
            if (data !== undefined && data.message !== undefined) {
                return data.message !== undefined ? data.message : "Data request is successfully.";
            }
            return xhr.responseJSON !== undefined && xhr.responseJSON.message !== undefined ? xhr.responseJSON.message : "Internal Server Error";
        },
        handleAjaxSuccess: function (data, status, xhr) {
            var message = data.message !== undefined ? data.message : "Data request is successfully.";
            $.notify({
                icon: 'glyphicon glyphicon-info-sign',
                message: message
            }, {
                    // settings
                    delay: 3000,
                    type: 'success'
                });
            return message;
        },
        handleAjaxError: function (xhr, status, error) {
            var message = xhr.responseJSON !== undefined && xhr.responseJSON.message !== undefined ? xhr.responseJSON.message : "Internal Server Error";
            var isSessionTimeOut = xhr.responseJSON !== undefined ? (xhr.responseJSON.sessiontimeOut !== undefined ? xhr.responseJSON.sessiontimeOut : false) : false;
            $.notify({
                // options
                icon: 'glyphicon glyphicon-exclamation-sign',
                message: message
            }, {
                    // settings
                    delay: 3000,
                    type: 'danger'
                });

            if (isSessionTimeOut === true) {
                window.location = "/";
            }
            return message;
        },
        applySelectAllTextOnFocus: function (selectors) {
            selectors = selectors || "input[type=text][role!=listbox],input.k-textbox[role!=listbox],textarea";
            $(selectors).on("focus", function () {
                var input = $(this);
                clearTimeout(input.data("selectTimeId")); //stop started time out if any

                var selectTimeId = setTimeout(function () {
                    input.select();
                });

                input.data("selectTimeId", selectTimeId);
            }).blur(function (e) {
                clearTimeout($(this).data("selectTimeId")); //stop started timeout
            });
        },
        applyRegExpTextBox: function (selector, pattern) {
            var j = selector instanceof jQuery ? selector : $(selector);
            j.on("keydown", function (e) {
                if (!pattern.test(e.key)) {
                    e.preventDefault();
                }
                //console.log(e.key);
            });
        },
        applyLetterTextBox: function (selectors) {
            var j = selectors instanceof jQuery ? selectors : $(selectors || "[data-role='lettertextbox']");
            j.on("keydown", function (e) {
                var pattern = /[A-Za-z0-9_-]/i;
                if (!pattern.test(e.key)) {
                    e.preventDefault();
                }
                //console.log(e.key);
            });
        },
        applyConfirmDialog: function (selectors) {
            selectors = selectors || "[data-role='confirm']";
            var dataOptionsMapping = {
                'title': 'title',
                //'title-class': 'titleClass',
                //'type': 'type',
                //'type-animated': 'typeAnimated',
                //'draggable': 'draggable',
                //'align-middle': 'alignMiddle',
                'content': 'content',
                'icon': 'icon',
                //'bg-opacity': 'bgOpacity',
                'theme': 'theme',
                //'animation': 'animation',
                //'close-animation': 'closeAnimation',
                //'animation-speed': 'animationSpeed',
                //'animation-bounce': 'animationBounce',
                'escape-key': 'escapeKey',
                //'rtl': 'rtl',
                //'container': 'container',
                //'container-fluid': 'containerFluid',
                //'background-dismiss': 'backgroundDismiss',
                //'background-dismiss-animation': 'backgroundDismissAnimation',
                //'auto-close': 'autoClose',
                //'close-icon': 'closeIcon',
                //'close-icon-class': 'closeIconClass',
                'use-bootstrap': 'useBootstrap'
            };

            $(selectors).each(function (index, elem) {
                $(elem).on('click', function (e) {
                    e.preventDefault();
                    var dataOptions = {};
                    $.each(dataOptionsMapping, function (attributeName, optionName) {
                        var value = $(elem).data(attributeName);
                        if (typeof value !== "undefined") {
                            dataOptions[optionName] = value;
                        }
                    });

                    var settings = $.extend(dataOptions, {
                        buttons: {
                            yes: {
                                text: "<i class=\"fa fa-check-circle\"></i> " + app.messages.confirmation.proceedButtonText,
                                keys: ['enter'],
                                btnClass: 'btn-primary btn-lg',
                                action: function () {

                                }
                            },
                            no: {
                                text: "<i class=\"fa fa-times-circle\"></i> " + app.messages.confirmation.cancelButtonText,
                                keys: ['esc'],
                                btnClass: 'btn-danger btn-lg',
                                action: function () {

                                }
                            }
                        }
                    });

                    var args = { isValid: true };
                    $(this).trigger("validating", [args]);
                    if (args.isValid) {
                        $(this).trigger("openDialog", [settings, elem]);
                        $.confirm(settings);
                    }
                });
            });
            return $(selectors);
        },
        showValidateSummary: function (errors, selector) {
            selector = selector || ".k-validation-summary";

            if (errors.length > 0) {
                var html = "<ul>";
                for (var idx = 0; idx < errors.length; idx++) {
                    html += "<li>" + errors[idx] + "</li>";
                }
                html += "</ul>";
                $(selector).show().empty().append($(html));
            } else {
                $(selector).hide();
            }
        },
        hideVaidationMessages: function (v, selector) {
            selector = selector || ".k-validation-summary";
            v.hideMessages();
            $(selector).hide();
        },
        initGridPopupEditor: function (e, options) {
            //<span class="k-icon k-i-save"></span> Save
            options = $.extend(true, {
                create: {
                    title: app.messages.grid.popupEditor.create.title,
                    button: {
                        text: app.messages.grid.popupEditor.create.button.text,
                        icon: "save",
                        content: ''
                    },
                    confirmation: false
                },
                edit: {
                    title: app.messages.grid.popupEditor.edit.title,
                    button: {
                        text: app.messages.grid.popupEditor.edit.button.text,
                        icon: "save",
                        content: ''
                    },
                    confirmation: false
                },
                cancelButton: {
                    text: app.messages.grid.popupEditor.cancelButton.text,
                    icon: "cancel",
                    content: ''
                }
            }, options || {});

            var updateButton = $(e.container).parent().find(".k-grid-update").removeClass("k-primary").addClass("k-dark");
            var cancelButton = $(e.container).parent().find(".k-grid-cancel").addClass("k-danger");
            var content = '';
            if (e.model.isNew()) {
                e.container.kendoWindow("title", options.create.title);
                content = options.create.button.content === '' ? kendo.format('<span class="k-icon k-i-{0}"></span> {1}', options.create.button.icon, options.create.button.text) : options.create.button.content;
                $(updateButton).html(content);
                e.container.find(".k-grid-update").on('click', function (ev) {
                    var isValid = true;
                    // Validator
                    if (options.validator !== undefined && options.validator.validate !== undefined) {
                        options.validator.hideMessages();
                        isValid = options.validator.validate();
                        if (!isValid) { ev.preventDefault(); return false; }
                    }
                    // Confirmation
                    if (isValid && options.create.confirmation !== false) {

                        var confirmOptions = { enabled: true, title: 'Are you sure that you want to proceed?' };

                        if (typeof options.create.confirmation === "string") {
                            confirmOptions = $.extend(true, confirmOptions, { enabled: true, title: options.create.confirmation });
                        }

                        if (typeof options.create.confirmation === "object") {
                            confirmOptions = $.extend(true, confirmOptions, options.create.confirmation);
                        }
                        if (!confirm(confirmOptions.title)) {
                            ev.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            } else {
                e.container.kendoWindow("title", options.edit.title);
                content = options.edit.button.content === '' ? kendo.format('<span class="k-icon k-i-{0}"></span> {1}', options.edit.button.icon, options.edit.button.text) : options.edit.button.content;
                $(updateButton).html(content);
                e.container.find(".k-grid-update").on('click', function (ev) {
                    var isValid = true;
                    // Validator
                    if (options.validator !== undefined && options.validator.validate !== undefined) {
                        options.validator.hideMessages();
                        isValid = options.validator.validate();
                        if (!isValid) { ev.preventDefault(); return false; }
                    }
                    // Confirmation
                    if (isValid && options.edit.confirmation !== false) {
                        var confirmOptions = { enabled: true, title: 'Are you sure that you want to proceed?' };

                        if (typeof options.edit.confirmation === "string") {
                            confirmOptions = $.extend(true, confirmOptions, { enabled: true, title: options.edit.confirmation });
                        }

                        if (typeof options.edit.confirmation === "object") {
                            confirmOptions = $.extend(true, confirmOptions, options.edit.confirmation);
                        }
                        if (!confirm(confirmOptions.title)) {
                            ev.preventDefault();
                            return false;
                        }
                    }
                    return true;
                });
            }

            var content = options.cancelButton.content === '' ? kendo.format('<span class="k-icon k-i-{0}"></span> {1}', options.cancelButton.icon, options.cancelButton.text) : options.cancelButton.content;
            $(cancelButton).html(content);
        },

        applyTableHover: function (grid, options) {
            if (grid.table.tableHover !== undefined) {
                options = $.extend(true, { rowClass: 'k-grid-row-hover', colClass: 'k-grid-column-hover' }, options || {});
                grid.table.tableHover(options);
            }
        },
        initNotification: function () {
            // require call partialview _KendoNotication
            return $("#notifications").kendoNotification({
                position: {
                    pinned: true,
                    top: 100,
                    right: 40
                },
                width: 400,
                autoHideAfter: 3000,
                stacking: "down",
                templates: [
                    {
                        type: "info",
                        template: "<div class=\"k-notification-container\">" +
                            "<div class=\"title\"><i class=\"fa fa-info-circle\"></i> #= title #</div>" +
                            "<div class=\"content\">#= message #</div>" +
                            "</div>"
                    }, {
                        type: "error",
                        template: "<div class=\"k-notification-container\">" +
                            "<div class=\"title\"><i class=\"fa fa-times-circle\"></i> #= title #</div>" +
                            "<div class=\"content\">#= message #</div>" +
                            "</div>"
                    }, {
                        type: "success",
                        template: "<div class=\"k-notification-container\">" +
                            "<div class=\"title\"><i class=\"fa fa-check-circle\"></i> #= title #</div>" +
                            "<div class=\"content\">#= message #</div>" +
                            "</div>"
                    }
                ]

            }).data("kendoNotification");
        },
        setCheckBox: function (selector, checked) {
            if (checked)
                selector.prop("checked", "checked");
            else
                selector.prop("checked", false);
        },
        applyUploadLocalize: function (selector) {
            var upload = $(selector).data("kendoUpload");
            $.extend(upload.options.localization, app.messages.upload);
        },
        handleSessionTimeout: function (e) {

        },
        initGridRowNo: function (grid, rowNoFieldName) {
            var page = grid.dataSource.page() || 1;
            var pageSize = grid.dataSource.pageSize() || grid.dataSource.data().length;
            var start = ((page - 1) * pageSize) + 1;
            rowNoFieldName = rowNoFieldName || "_rowNo";

            $.each(grid.dataSource.view(), function (index, item) {
                item[rowNoFieldName] = start + index;
            });
        },
        enableGridRequestData: function (grid, enable) {
            if (grid == undefined) { return; }
            var j = grid instanceof jQuery ? grid : (grid.element !== undefined ? grid.element : $(grid));
            var g = j.data("kendoGrid");
            j.attr("k-enable-request", enable);
        },
        handleGridRequestStart: function (grid, e, requestCallback, preventCallback) {
            if (grid == undefined) { return; }
            var j = grid instanceof jQuery ? grid : (grid.element !== undefined ? grid.element : $(grid));
            var g = j.data("kendoGrid");
            var allowRequestData = j.is("[k-enable-request]") ? j.attr("k-enable-request") == "true" : true;
            if (allowRequestData) {
                //$(".k-grid-header .k-link", j).off("click");
                if (requestCallback && typeof (requestCallback) === "function") {
                    requestCallback();
                }

                g.dataSource.one("requestEnd", function (ev) {
                    setTimeout(function () {
                        if (ev.sender.data().length > 0) {
                            $(".k-grid-header .k-link", j).off("click");
                        } else {
                            $(".k-grid-header .k-link", j).on("click", function (e) {
                                e.preventDefault();
                                e.stopPropagation();
                                return false;
                            });
                        }
                    }, 100);
                });
            } else {
                e.preventDefault();
                $(".k-grid-header .k-link", j).on("click", function (e) {
                    e.preventDefault();
                    e.stopPropagation();
                    return false;
                });

                if (preventCallback && typeof (preventCallback) === "function") {
                    preventCallback();
                }
            }
        },
        resizeGrid: function (selector) {
            if ($.isArray(selector)) {
                $.each(function (index, item) {
                    var grid = $(item).data("kendoGrid");
                    if (grid) {
                        grid.resize();
                    }
                });
            } else {
                var grid = $(selector).data("kendoGrid");
                if (grid) {
                    grid.resize();
                }
            }
        },
        getUrlVars: function () {
            var vars = [], hash;
            var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
            for (var i = 0; i < hashes.length; i++) {
                hash = hashes[i].split('=');
                vars.push(hash[0]);
                vars[hash[0]] = hash[1];
            }
            return vars;
        },
        uiEnable: function (selector, enable) {
            if (enable) {
                if ($.isArray(selector)) {
                    $.each(selector, function (index, item) {
                        if (item.enable !== undefined) {
                            item.enable(true);
                        } else {
                            $(item).removeAttr('disabled').removeClass('k-state-disabled');
                        }
                    });
                } else {
                    $(selector).removeAttr('disabled').removeClass('k-state-disabled');
                }
            }
            else {
                if ($.isArray(selector)) {
                    $.each(selector, function (index, item) {
                        if (item.enable !== undefined) {
                            item.enable(false);
                        } else {

                            // 2018-10-16 Teerayut S. Old: CSS is disable but can click control.
                            //$(item).removeAttr('disabled').addClass('k-state-disabled');
                            $(item).attr('disabled', 'disabled').addClass('k-state-disabled');
                        }
                    });
                } else {

                    // 2018-10-16 Teerayut S.
                    //$(selector).removeAttr('disabled').addClass('k-state-disabled');
                    $(selector).attr('disabled', 'disabled').addClass('k-state-disabled');
                }
            }
        },
        selectFirstDropDownItem: function (w) {
            var dataItems = w.dataSource.view().toJSON();
            if (dataItems.length > 0) {
                w.select(w.options.optionLabel === "" ? 0 : 1);

                // Solve: MVVM not update when set default select via method.
                w.trigger("change");
            }
        },
        ordinals: function (v) {
            switch (v % 20) {
                case 1: return v + "st";
                case 2: return v + "nd";
                case 3: return v + "rd";
                default: return v + "th";
            }
        }
    },
    initPage: function () {
        this.ui.initAjax();
        this.ui.applySelectAllTextOnFocus();
        this.ui.applyConfirmDialog();
        this.ui.preventKeyEventInPage();
        this.ui.handleDatePickerChange();
    },
    initPopupEditor: function () {
        this.ui.applySelectAllTextOnFocus();
        this.ui.handleDatePickerChange();
    },
    setLocation: function (url) {
        window.location.href = url;
    },
    guid: function () {
        function _p8(s) {
            var p = (Math.random().toString(16) + "000000000").substr(2, 8);
            return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
        }
        return _p8() + _p8(true) + _p8(true) + _p8();
    },
    addAntiForgeryToken: function (data) {
        //if the object is undefined, create a new one.
        if (!data) {
            data = {};
        }
        //add token
        var tokenInput = $('input[name=__RequestVerificationToken]');
        if (tokenInput.length) {
            data.__RequestVerificationToken = tokenInput.val();
        }
        return data;
    },
    displayFileSize: function (size) {
        var units = ['Bytes', 'KB', 'MB', 'GB'];
        for (var i = 0; i < units.length; i++) {
            if (size < 1024) { return kendo.toString(size, "n2") + " " + units[i]; }
            size = parseFloat(size) / 1024;
        }
        return kendo.toString(size, "n2");
    }
};

var CheckBoxHelper = function (selector, dataStateId) {
    var checkbox = selector;
    var id = dataStateId;

    this.updateDataState = function () {
        var dataItems = JSON.parse($(id).val() || "[]");
        $(checkbox).each(function (index, item) {
            var value = this.value;
            dataItems = $.grep(dataItems, function (dataItem) {
                return dataItem !== value;
            });

            if (this.checked) {
                dataItems.push(value);
            }
        });
        $(id).val(kendo.stringify(dataItems));
    };

    this.updateUIState = function () {
        var dataItems = JSON.parse($(id).val() || "[]");
        app.ui.setCheckBox($(checkbox), false);
        $.each(dataItems, function (index, item) {
            app.ui.setCheckBox($(checkbox + "[value='" + item + "']"), true);
        });
    };

    this.applyChange = function (cb) {
        $(checkbox).on("change", function (e) {
            var dataItems = JSON.parse($(id).val() || "[]");
            var value = this.value;
            dataItems = $.grep(dataItems, function (dataItem, index) {
                return dataItem !== value;
            });
            if (this.checked) {
                dataItems.push(this.value);
            }
            $(id).val(kendo.stringify(dataItems));

            if (cb !== undefined) {
                cb();
            }
        });
    };

    this.getDataState = function () {
        return JSON.parse($(id).val() || "[]");
    };

    this.clearDataState = function () {
        $(id).val("[]");
    };

    this.validate = function (maxSelectedItems) {
        var dataItems = JSON.parse($(id).val() || "[]");
        if (maxSelectedItems == undefined) { return true; }
        return dataItems.length < maxSelectedItems;
    };
};

var KendoGridHelper = function (selector, enabledRequestData) {
    this.enabledRequestData = enabledRequestData || true;
    this.selector = selector;

    this.enableRequestData = function (enabled) {
        var j = $(this.selector);
        var g = j.data("kendoGrid");

        j.attr("k-enable-request", enabled);
        if (!enabled) {
            g.dataSource.sort({});

        } else {
            //$(".k-grid-header .k-link", j).off("click");
        }
    };

    this.handleRequestStart = function (e, requestCallback, preventCallback) {
        var j = $(this.selector);
        var g = j.data("kendoGrid");

        var allowRequestData = j.is("[k-enable-request]") ? j.attr("k-enable-request") == "true" : this.enabledRequestData;
        if (allowRequestData) {
            $(".k-grid-header .k-link", j).off("click");
            if (requestCallback && typeof (requestCallback) === "function") {
                requestCallback();
            }
        } else {
            e.preventDefault();
            if (preventCallback && typeof (preventCallback) === "function") {
                preventCallback();
            }

            $(".k-grid-header .k-link", j).on("click", function (e) {
                e.preventDefault();
                e.stopPropagation();
                return false;
            });
        }
    };

    this.notifyNoData = function (message) {
        if (widget.dataSource.data().length == 0) {
            message = message || app.messages.dataSource.noRecordFound;
            $.notify({
                icon: 'glyphicon glyphicon-info-sign',
                message: message
            }, {
                    // settings
                    delay: 3000,
                    type: 'info'
                });
        }
    };
};

// ui.register("search",".k-button");
// ui.register("search",[{ elem: ".k-button-search", busyContent: ""},{elem: ".k-button"}]);
// ui.register("search",[".k-button-search",".k-button"]);
var AppUIState = function () {
    var uiStates = [];
    this.register = function (name, options) {

        for (var i = 0; i < uiStates.length; i++) {
            if (uiStates[i].name == name) {
                uiStates.splice(i, 1);
                break;
            }
        }

        if ($.isArray(options)) {
            var data = { 'name': name, 'targets': [] };
            $.each(options, function (i, item) {
                if (item.elem !== undefined) {
                    var selector = item.elem instanceof jQuery ? item.elem : $(item.elem);
                    data.targets.push({
                        'elem': selector,
                        'content': $(item.elem).html(),
                        'busyContent': item.busyContent
                    });
                } else {
                    var selector = item instanceof jQuery ? item : $(item);
                    data.targets.push({ 'elem': selector });
                }

            });
            uiStates.push(data);
        } else {
            var selector = item instanceof jQuery ? item : $(item);
            uiStates.push({
                'name': name,
                'targets': [{ 'elem': selector }]
            });
        }
    };
    this.clear = function () {
        uiStates = [];
    };

    this.busy = function (name, isBusy) {
        if (isBusy) {
            var ui = $.grep(uiStates, function (item, i) {
                return item.name === name;
            });

            $.each(ui, function (i, item) {
                $.each(item.targets, function (index, target) {
                    $.each(target.elem, function (index2, t) {
                        var elem = $(t);
                        if (elem.hasClass("k-state-disabled") || elem.is("[disabled]")) { return; }
                        elem.attr('disabled', true).attr("ui-state-disabled", true).addClass('k-state-disabled');
                        if (target.busyContent !== undefined) {
                            elem.html(target.busyContent);
                        }
                    });
                });
            });
        } else {
            var ui = $.grep(uiStates, function (item, i) {
                return item.name === name;
            });

            $.each(ui, function (i, item) {
                $.each(item.targets, function (index, target) {
                    $.each(target.elem, function (index2, t) {
                        var elem = $(t);
                        if (elem.is("[ui-state-disabled]")) {
                            elem.removeAttr('disabled').removeAttr("ui-state-disabled").removeClass('k-state-disabled');
                            if (target.content !== undefined) {
                                elem.html(target.content);
                            }
                        }
                    });
                });
            });
        }
    };
};

(function ($, kendo) {
    $.extend(true, kendo.ui.validator, {
        rules: {
            required: function (input) {
                return !(input.is("[data-val-required]") && $.trim(input.val()) === "");
            },
            mvcdate: function (input) {
                if (input.is("[data-val-date]") && input.val() !== "") {
                    var format = "d/MM/yyyy";
                    if (input.is("[data-format]"))
                    {
                        format = input.data("format");
                    }
                    var date = kendo.parseDate(input.val(), format);
                    return date !== null;
                }
                return true;
            }
        },
        messages: {
            required: function (input) {
                var field = input.data("field");
                if (field)
                    return kendo.format(app.messages.validators.required, field);
                return app.messages.validators.required;
            }
        }
    });
})(jQuery, kendo);


$(function () {
    if ($.scrollUp !== "undefined") {
        $.scrollUp({
            scrollName: 'scroll-up',
            animationSpeed: '600',
            scrollText: '<i class="fa fa-4x fa-chevron-circle-up"></i>',
            scrollTitle: app.messages.scrollToTop
        });
    }

    //$.fn.bootstrapDropdownHover({ clickBehavior: 'default', hideTimeout: 1000 });
});