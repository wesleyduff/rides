app //Our module. Assigned as a global variable in scripts.js


/*----------------------------------------------------------------
//----Notifications
// ------
 <div class="alert alert-success">...</div>
 <div class="alert alert-info">...</div>
 <div class="alert alert-warning">...</div>
 <div class="alert alert-danger">...</div>
//-------------------------------------------------------------- */
    .factory('notificationService', function($timeout){
        return {
            notification: function(message, ele, level ){
                var html;
                switch(level){
                    case 'success':
                        html = '<div class="alert alert-success"><strong>'+message+'</strong></div>';
                        break;
                    case 'info' :
                        html = '<div class="alert alert-info"><strong>'+message+'</strong></div>';
                        break;
                    case 'warning' :
                        html = '<div class="alert alert-warning"><strong>'+message+'</strong></div>';
                        break;
                    case 'danger' :
                        html = '<div class="alert alert-danger"><strong>'+message+'</strong></div>';
                        break;
                    default :
                        html = '<div class="alert alert-danger"><strong>'+message+'</strong></div>';
                        break;
                }
                ele.prepend(html);
                $timeout(function() {
                    var alert = ele.find('.alert');
                    alert.fadeOut(600);
                    $timeout(function(){
                        alert.remove();
                    },700);
                }, 2500);
            }
        }
    });