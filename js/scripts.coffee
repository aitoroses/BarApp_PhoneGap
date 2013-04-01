$(document).ready ->

	# Load home
	
	$(document).ready ->
		$('#main').load('sections/home/index.html')

	# Navigation behavior

	$('#nav a').click (e) ->
		App.closeNav()
		$(this).parent().addClass('is-active')
		$('#nav a').parent().removeClass('is-active')
		e.preventDefault()
		rel = $(this).attr('rel')

		switch rel
			when "1" 
				$('#main').load('sections/home/index.html')
			when "2"
				$('#main').load 'sections/chart/index.html'
			when "3"
				$('#main').load('sections/likes/index.html')
			when "4"
				$('#main').load('sections/employees/index.html')
			else