let var1, var2,var3 ;

$(document).ready(function () {


  const values = {
    clvmunicipio: 0
  }
    $.ajax({
      
      method: 'POST',
      url: '/dashboard/analyticsafiliaciones',
      data: values,
      success: function (result) {
          if (!result) {
              console.log('No hay respuesta en el server');
          } else {
              
              result.forEach(element => {
                  
                    'use strict'

  /* ChartJS
   * -------
   * Here we will create a few charts using ChartJS
   */

  //-----------------------
  //- MONTHLY SALES CHART -
  //-----------------------

  //---------------------------
  //- END MONTHLY SALES CHART -
  //---------------------------

  //-------------
  //- PIE CHART -
  //-------------
  // Get context with jQuery - using jQuery's .get() method.
  var pieChartCanvas = document.getElementById('pieChart').getContext('2d');
  var pieChart       = new Chart(pieChartCanvas);


 
  var PieData        = [
    {
      value    : element[0],
      color    : '#dc3545',
      highlight: '#dc3545',
      label    : 'San Andrés Tuxtla'
    },
    {
      value    : 20,
      color    : '#28a745',
      highlight: '#28a745',
      label    : 'Catemaco'
    },
    {
      value    :  10,
      color    : '#ffc107',
      highlight: '#ffc107',
      label    : 'Hueyapan de Ocampo'
    },
   
  ]
  var pieOptions     = {
    //Boolean - Whether we should show a stroke on each segment
    segmentShowStroke    : true,
    //String - The colour of each segment stroke
    segmentStrokeColor   : '#fff',
    //Number - The width of each segment stroke
    segmentStrokeWidth   : 1,
    //Number - The percentage of the chart that we cut out of the middle
    percentageInnerCutout: 50, // This is 0 for Pie charts
    //Number - Amount of animation steps
    animationSteps       : 100,
    //String - Animation easing effect
    animationEasing      : 'easeOutBounce',
    //Boolean - Whether we animate the rotation of the Doughnut
    animateRotate        : true,
    //Boolean - Whether we animate scaling the Doughnut from the centre
    animateScale         : false,
    //Boolean - whether to make the chart responsive to window resizing
    responsive           : true,
    // Boolean - whether to maintain the starting aspect ratio or not when responsive, if set to false, will take up entire container
    maintainAspectRatio  : false,
    //String - A legend template
    legendTemplate       : '<ul class="<%=name.toLowerCase()%>-legend"><% for (var i=0; i<segments.length; i++){%><li><span style="background-color:<%=segments[i].fillColor%>"></span><%if(segments[i].label){%><%=segments[i].label%><%}%></li><%}%></ul>',
    //String - A tooltip template
    tooltipTemplate      : '<%=value %> <%=label%> Personas'
  }
  //Create pie or douhnut chart
  // You can switch between pie and douhnut using the method below.
  pieChart.Pie(PieData, pieOptions)
  //-----------------
  //- END PIE CHART -
  //-----------------

  /* jVector Maps
   * ------------
   * Create a world map with markers
   */


  /* SPARKLINE CHARTS
   * ----------------
   * Create a inline charts with spark line
   */

  //-----------------
  //- SPARKLINE BAR -
  //-----------------


  //-----------------
  //- SPARKLINE PIE -
  //-----------------


  //------------------
  //- SPARKLINE LINE -
  //------------------

 
              });
          }
      }
  });
 

  

});
