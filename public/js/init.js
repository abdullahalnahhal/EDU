(function(){
	$(".command").on('change click', function(){
		$command = $(this).attr('command');
		call('command', $command, $(this))
	});
})();

call = function(class_name , function_name , param)
{
	return window[class_name][function_name](param) ;
}

Common = function()
{
	this.elementSearch = function(text, element_class, type = 'text')
	{
		new_text = text.toLowerCase().trim();
		$("."+element_class).each(function(index, el){
			if (type == 'text') {
				search_text = $(this).text();
			}else{
				$($(this).find(type)).each(function(index, el) {
					search_text = $(this).val();
					if (search_text.trim()) {
						return;
					}
				});
			}
			is_found = search_text.indexOf(new_text);
			if (is_found > -1) {
				$(this).show(0);
			}else{
				$(this).hide(0);
			}
		});
	}
	this.confirm = function(message, action, url=null)
	{
		confirm = confirm(message);
		if (confirm == true) {
			switch (action) {
				case 'url':
					window.location.href = url;
					break;
			}
		}
	}
	this.getSelected = function()
	{
		selected = [];
		$("input[type='checkbox']").each(function(index, el){
			if (Number($(this).prop('checked'))) {
				value = $(this).val();
				selected.push(value);
			}
		});
		return selected;
	}
	this.selectionCheck = function()
	{
		selected = this.getSelected();
		if (!empty(selected)) {
			return selected;
		}
		template.alert('error', 'Select First Please');
		return false;
	}
	this.redirect = function(url)
	{
		window.location.href = url;
	}
	this.unduplicate = function(item, step, hidden)
	{
		$('#'+item+'-'+step).remove();
		removable = storage.counter[item].elements.indexOf(step);
		storage.counter[item].elements.splice(removable, 1);
		elements = storage.counter[item].elements;
		$("#"+hidden).val(elements);
	}
}

Command = function ()
{
	this.filler = function (element)
	{
		val = element.val();
		fill = element.attr('fill');
		if (isset(element.attr('fill-type'))) {
			fill_type = element.attr('fill-type');
		}else{
			fill_type = 'id';
		}
		if (fill_type == 'class')
		{
			fill_type = '.';
		}else{
			fill_type = '#';
		}
		if (val) {
			source = element.attr('source');
			source = source.replace("%id%", val);
			spinner = element.attr('spinner');
			filling_data = element.attr('make-data');
			option_value = element.attr('option-value');
			option_text = element.attr('option-text');
			data = server.call('get', source, null, function(data){
			opts = filler.options(data, option_value, option_text);
			if (opts) {
				opts = "<option></option>"+opts;
				console.log(fill_type+fill);
				$(fill_type+fill).html(opts);
				$(fill_type+fill).prop('disabled', false);
			}else{
				$(fill_type+fill).html("");
				$(fill_type+fill).prop('disabled', true);
			}
			}, function(){}, function(){
				$("#"+spinner).show();
			}, function(data){
				$("#"+spinner).hide();
			});
		}else{
			$("#"+fill).html("");
			$("#"+fill).prop('disabled', true);
		}
	}
	this.uploader = function (element)
	{
		viewer = element.attr('viewer');
		input = element.attr('input');
		if (!isset(storage['old-img'])) {
			storage['old-img'] = $("#"+viewer).attr('src');
		}
		$("#"+input).click();
		$("#"+input).change(function() {
			if (this.files && this.files[0]){
				var reader = new FileReader();
				reader.onload = function(e) {
			      $('#'+viewer).attr('src', e.target.result);
			    }
			    reader.readAsDataURL(this.files[0]);
			}
			$("#"+viewer).attr('src', storage['old-img']);
		});
	}
	this.modal = function (element)
	{
		modal = element.attr("modal");
		$("#"+modal).modal('show');
		if (isset(element.attr("info"))) {

			info = element.attr("info");
			info = JSON.parse(info);

			for (prop in info) {
					filler.formAction($('#'+modal+' form') ,info[prop]);
				}
			}
	}
	this.check = function (element)
	{
		check = element.attr('check');
		value = element.val();
		$("#"+check).prop('checked', true);
	}
	this.checkAll = function (element)
	{
		is_chek_list = isset(element.attr('check-list'));
		if (is_chek_list) {
			check_list = element.attr('check-list');
			checks = $("#"+check_list);
		}else{
			checks = $("input[type='checkbox']");
		}
		checks.prop('checked', true);
	}
	this.unCheckAll = function (element)
	{
		is_chek_list = isset(element.attr('check-list'));
		if (is_chek_list) {
			check_list = element.attr('check-list');
			checks = $("#"+check_list);
		}else{
			checks = $("input[type='checkbox']");
		}
		checks.prop('checked', false);
	}
	this.formSubmit = function (element)
	{
		form = element.attr('form');


		if(isset(element.attr('action'))) {
			action = element.attr('action');
			console.log($("#"+form).size());
			$("#"+form).attr('action', action);
		}

		$("#"+form).submit();
	}
	this.search = function(element)
	{
		type = element.attr('search-type');
		if (isset(element.attr('source'))) {
			source = element.attr('source');
			if (source == 'text') {
				search = element.text();
			}
		}else{
			search = element.val();
		}
		if (isset(type)) {
			if (type == 'front') {
				elements = element.attr('elements');
				target = element.attr('target');
				common.elementSearch(search, elements, target);
			}
		}
	}
	this.confirm = function(element)
	{
		action = element.attr('action');
		message = element.attr('message');
		if (action == 'url') {
			url = element.attr('url');
			common.confirm(message, action, url);
		}
	}
	this.confirmSelected = function(element)
	{
		selected = common.getSelected();
		selected ={"selected":selected};
		selected = $.param(selected);
		action = element.attr('action');
		message = element.attr('message');
		if (action == 'url') {
			url = element.attr('url');
			common.confirm(message, action, url+"?"+selected);
		}
	}
	this.supmitSelected = function(element)
	{
		selected  = common.selectionCheck();
		if (!selected) {
			return false;
		}
		action = element.attr('action');
		form = element.attr('form');
		name = element.attr('name');
		$("#"+name).val(selected);
		if (action != 'hidden') {
			action = element.attr('action');
			$("#"+form).attr('action', action);
		}
		$("#"+form).submit();
	}
	this.redirect = function (element)
	{
		value = element.val();
		url = element.attr('url');
		if (isset(value)) {
			window.location.href = url.replace('%value%', value);
		}
	}
	this.backendSearch = function(element)
	{
		element.keyup(function(event) {
			hot_key.on('enter',function(){
				result_type = element.attr('result-type');
				search = element.val();
				if (result_type == 'redirect') {
					url = element.attr('url');
					url = url.replace("%search%", search);
					common.redirect(url);
				}
			})
		});
	}

	this.duplicate = function(element)
	{
		temp = element.attr('template');
		target = element.attr('target');
		hidden = element.attr('hdn');
		template_name = temp;
		original = $('#'+temp);
		temp = $('#'+temp).clone();
		temp.removeClass('command');
		temp.removeAttr('template');
		temp.removeAttr('items');
		elements = element.attr('items');
		elements = elements.split(",");
		if (!isset(storage.counter)) {
			storage['counter'] = {};
		}
		if (!isset(storage.counter[template_name])) {
			storage['counter'][template_name] = {};
			storage['counter'][template_name]['step'] = 1;
			storage.counter[template_name]['elements'] = [0];
		}
		for (var i = 0; i < elements.length; i++) {
			if (temp.find('[item="'+elements[i]+'"]').attr('type') == 'checkbox') {
				temp.find('[item="'+elements[i]+'"]').attr('value', storage.counter[template_name].step);
				temp.find('[item="'+elements[i]+'"]').attr('name', elements[i]+"[]");
			}else{
				temp.find('[item="'+elements[i]+'"]').attr('name', elements[i]+"-"+storage.counter[template_name].step);
			}
			temp.find('[item="'+elements[i]+'"]').attr('id', elements[i]+"-"+storage.counter[template_name].step);
			temp.find('[item="counter"]').text(storage.counter[template_name].step+1);
		}

		temp.attr('id', template_name+"-"+storage.counter[template_name].step);
		temp.append(template.remove(template_name, storage.counter[template_name].step, hidden));
		storage.counter[template_name]['elements'].push(storage.counter[template_name].step);
		storage.counter[template_name].step ++;

		$("#"+hidden).val(storage.counter[template_name]['elements']);

		$("#"+target).append(temp);
	}
}


Filler = function()
{
	this.options = function(data, option_value, option_text)
	{
		opts = "";
		for (prop in data) {
			opts+="<option value='"+data[prop][option_value]+"'>"+data[prop][option_text]+"</option>\n";
		}
		return opts;
	}
	this.formAction = function(form, url)
	{
		form.attr('action', url);
	}
}

Server = function()
{
	/**
	* Call to server
	* @param {string} type the request method post or get
	* @param {string} url to call and send requests
	* @param {Object} data to send through http
	* @param {callback} success to call when request is success
	* @param {callback} failuer to call when request is failuer
	* @param {callback} waiting to call when request is waiting
	* @param {callback} completed to call when request is completed
	*/
	this.call = function(type, url, data, success, failuer, waiting, completed)
	{
		waiting();
		$.ajax({
				url: url,
				type: type,
				data: data,
				async: false,
				cache: false,
		        contentType: false,
		        processData: false,
				success: function (data)
				{
					success(data);
				},
				error: function(xhr, error)
				{
			        failuer(xhr, error);
			 	},
			 	complete: function()
			 	{
			 		completed();
			 	}
			});
	}
}

Templates = function()
{
	this.alert = function(type, message)
	{
		switch (type) {
			case 'error':
			console.log('ss');
				showNotification("bg-black", message, "bottom", 'right', "animated fadeIn", "animated flipOutY");
				break;
		}
	}

	this.remove = function (removable, step, hidden) {
		element = '<div class="col-2 pt-1">\n'+
			'<div class="form-group">\n'+
				'<button type="button" class="btn btn-danger btn-flat btn-addon" onclick="common.unduplicate(\''+removable+'\', \''+step+'\', \''+hidden+'\')">\n'+
					'<i class="ti-minus" item="remove" ></i>\n'+
				'</button>\n'+
			'</div>\n'+
		'</div>\n';
		return element;
	}
}

var isset = function(variable)
{
	if (typeof variable !== 'undefined') {
		return true
	}
	return false;
}
var empty = function(array)
{
	if (!Array.isArray(array)) {
		throw "variable not Array !";
	}
	if (array == null || !array.length) {
		return true
	}else{
		return false
	}
}



storage = {};
window.command = new Command();
window.filler = new Filler();

common = new Common();
server = new Server();
template = new Templates();
filler = new Filler();
