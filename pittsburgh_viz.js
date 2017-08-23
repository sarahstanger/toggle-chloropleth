/* chloropleth of commute to work mode by neighborhood */

/* cluster neighborhoods by education and commute transport mode. link to map? */

/* http://blog.visual.ly/how-to-make-choropleth-maps-in-d3/ */


/*

 drop down of available datasets to choose from
 color chloropleth according to choice




*/
var whichOnes = { bus:true,
				  bike: false,
				  car: false,
				  carpool: false,
				  home: false,
				  walk:false,
				  other: false
				  };

var dataset = [];

function buttonListeners(){
	$(".control_button").click(function(){
		$(this).toggleClass("selected_button");

		whichOnes[$(this).attr("id")] = !(whichOnes[$(this).attr("id")]);
		colorSVG();
	});
}


function colorSVG(){
	// $("#regent_square").css("fill", "magenta");
	d3.csv("PGHSNAP-Transportation.csv", function(data){
		//callback function
		dataset = data;
		console.log("data loaded");

		var regexp = new RegExp(/[-: ]/);
		var number_regexp = new RegExp(/_\d/g);
		var data_hood_name = "";
		var dom_hood_name = "";
		var fillColor = "#FFFFFF";
		var percent = 0;

		var neighborhoods = d3.selectAll(".neighborhood").attr("fill", function(d){
			//some of the neighborhoods are paths, some are polylines
			//lincoln_lemington_belmar is divided into two where it crosses the river

			//apply tooltip here?

			var $svgElement = $(this);

			dom_hood_name = (this.id).replace(regexp, "_").toLowerCase();  //replaces all spaces/dashes with underscores
			dom_hood_name = dom_hood_name.replace(number_regexp, "");

			$.each(dataset, function(i){
				data_hood_name = (dataset[i].Neighborhood).replace(regexp, "_").toLowerCase();

				if(data_hood_name == dom_hood_name){
					var title = $svgElement.attr("title");

					//title = title + "Bus - " + dataset[i]["Commute to Work: Public Transportation (2010)"] + "\n";
					//title = title + "Walk - " + dataset[i]["Commute to Work: Walk (2010)"] + "\n";

					//$svgElement.attr("title", title);

					fillColor = "#FFFFFF";

					//get the data for this neighborhood
					percent = 0;

					if(whichOnes["bus"]){
						percent = percent + parseInt(dataset[i]["Commute to Work: Public Transportation (2010)"]);
					}
					if(whichOnes["walk"]){
						percent = percent + parseInt(dataset[i]["Commute to Work: Walk (2010)"]);
					}
					if(whichOnes["car"]){
						percent = percent + parseInt(dataset[i]["Commute to Work: Drive Alone (2010)"]);
					}
					if(whichOnes["bike"]){
						percent = percent + parseInt(dataset[i]["Commute to Work: Bicycle (2010)"]);
					}
					if(whichOnes["carpool"]){
						percent = percent + parseInt(dataset[i]["Commute to Work: Carpool/Vanpool (2010)"]);
					}
					if(whichOnes["home"]){
						percent = percent + parseInt(dataset[i]["Work at Home (2010)"]);
					}
					if(whichOnes["other"]){
						percent = percent + parseInt(dataset[i]["Commute to Work: Taxi (2010)"]);
						percent = percent + parseInt(dataset[i]["Commute to Work: Motorcycle (2010)"]);
						percent = percent + parseInt(dataset[i]["Commute to Work: Other (2010)"]);
					}

					if(percent > 80){
						fillColor= "#0a4037";
					} else if(percent <= 80 && percent > 60 ){
						fillColor = "#19685b";
					} else if(percent <= 60 && percent > 40){
						fillColor = "#3d8e7e";
					} else if(percent <= 40 && percent > 20){
						fillColor = "#66b2a3";
					} else if(percent <= 20 && percent > 0){
						fillColor =  "#b7e2da";
					} else {
						// data N/A or weirdly formatted
						fillColor =  "#FFFFFF";
					}
				}
				return fillColor;
			});
			return fillColor;
		});
	});
}