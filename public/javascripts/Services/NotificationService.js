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
                        html = '<div class="alert alert-success">'+message+'</div>';
                        break;
                    case 'info' :
                        html = '<div class="alert alert-info">'+message+'</div>';
                        break;
                    case 'warning' :
                        html = '<div class="alert alert-warning">'+message+'</div>';
                        break;
                    case 'danger' :
                        html = '<div class="alert alert-danger">'+message+'</div>';
                        break;
                    default :
                        html = '<div class="alert alert-danger">'+message+'</div>';
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