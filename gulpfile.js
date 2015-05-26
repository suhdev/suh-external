var gulp = require('gulp'),
	concat =require('gulp-concat'),
	uglify= require('gulp-uglify'),
	rename = require('gulp-rename'),
	ngdocs = require('suh-dgeni-ngdocs'),
	path = require('canonical-path'),
	PATHS = {
		JS:{
			SRC:['./src/*.js','./src/**/*.js']
		}
	}; 

gulp.task('concat-js',function(){
	return gulp.src(PATHS.JS.SRC)
	  .pipe(concat('suh-external.js'))
	  .pipe(gulp.dest('./'))
	  .pipe(uglify())
	  .pipe(rename('suh-external.min.js'))
	  .pipe(gulp.dest('./'));
});

gulp.task('docs',['concat-js'],function(){
	try{
		ngdocs.generate({
	defaultDeployment:{
		name:'default',
		meta:{
			description:'This is just a test suite'
		},
		navigation:{
			top:{
				navItems:[{
            		type:'divider',
          		},
          		{
		            type:'dropdown',
		            disabled:true,
		            label:'TestModule Documentation',
		            url:'#',
		            menu:[{
			              	label:'API Reference',
			              	url:'api'
			            },{
			              	label:'Guides',
			              	url:'guide'
			            },{
			            	label:'Suhail',
			            	url:'suhail'
			            }
			        ]
          		},
          		{
          			type:'divider'
          		}]
			}
		},
		scripts:[path.resolve('./suh-external.min.js')]
	},
	basePath:path.resolve('src'),
	scripts:[],
	stylesheets:[],
	fonts:[],
	sourceFiles:[path.resolve('./suh-external.js')],
	AREA_NAMES:{
		suhail:'Suhail Abood',
	},
	outputFolder:path.resolve('generated'),
	homePage:{
		data:{
			title:'Suhail Abood Library',
			description:'A library to do something.',
			dependencies:[{
				name:'angular',
				version:'1.3.15'
			},{
				name:'jquery',
				version:'2.1.13'
			}]
		}
	},
	logger:{
		level:null
	},
	extraData:{
		angular:'1.3.15',
		name:'Suhail Abood',
		module:{
			version:'v1.0.0',
			file:'suh-external.js',
			minifiedFile:'suh-external.min.js'
		}
	}
});
	}catch(e){
		console.log(e);
	}
});

gulp.task('watch',['concat-js'],function(){
	return gulp.watch(PATHS.JS.SRC,['concat-js','docs']);
});

gulp.task('default',['watch'],function(){

});