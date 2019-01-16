<form method="post" action="{{route('teachers.groups.update', ['id'=>$group->id])}}" autocomplete="off">
	@method('PUT')
	@csrf
	<div class="row">
		<div class="col-md-6 col-12">
			<div class="form-group">
				<label class="control-label">@lang('groups.Term name')</label>
				<input type="text" id="group" name="group" class="form-control" placeholder="@lang('terms.Term name')" value="{{old('group')??$group->group}}"  minlength="3" maxlength="50" required>
			</div>		
		</div>
		<div class="col-md-6 col-12">
			<div class="form-group">
				<label class="control-label">@lang('groups.Level')</label>
				@include('layouts.dropdowns.levels.levels',[
					'classes'=>'command',
					'selected_id'=>@old('level_id')??$group->level_id,
					'extensions'=> [
						'command'=>'filler',
						'fill'=>'year_id',
						'source' => route('teachers.levels.years.get', ["id"=>"%id%"]),
						'make-data' => 'options',
						'spinner' => 'levels-spinner',
						'option-value'=>'id',
						'option-text'=>'year',
					],
				])
			</div>
		</div>
	</div>
	<div class="row">		
		<div class="col-md-6 col-12">
			<div class="form-group">
				<label class="control-label">@lang('groups.Year')</label>
				@include('layouts.dropdowns.years.years',[
					'classes'=>'command',
					'selected_id'=>@old('year_id')??$group->year_id,
					'extensions'=> [
						'command'=>'filler',
						'fill'=>'term_id',
						'source' => route('teachers.years.terms.get', ["id"=>"%id%"]),
						'make-data' => 'options',
						'spinner' => 'years-spinner',
						'option-value'=>'id',
						'option-text'=>'term',
					],
				])
			</div>
		</div>
		<div class="col-md-6 col-12">
			<div class="form-group">
				<label class="control-label">@lang('groups.Year')</label>
				@include('layouts.dropdowns.terms.terms', [
					'selected_id'=>@old('term_id')??$group->term_id,
				])
			</div>
		</div>
	</div>
	<div class="form-group">
		<button type="submit" class="btn btn-block btn-flat btn-primary btn-addon">
			<i class='ti-save'></i> @lang('common.Save')
		</button>
	</div>
</form>