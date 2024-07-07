// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks"));
let nextId = JSON.parse(localStorage.getItem("nextId"));

const todo = "todo";
const inProgress = "in-progress";
const done = "done";
// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const dueDate = dayjs(task.dueDate);
    const currentDate = dayjs();
    const isOverdue = dueDate.isBefore(currentDate);
    const isNearingDeadline = dueDate.diff(currentDate, 'day') <= 2 && !isOverdue;
    let cardClass = '';
  
    if (isOverdue) {
      cardClass = 'bg-danger text-black';
    } else if (isNearingDeadline) {
      cardClass = 'bg-warning';
    }
  
    return `
      <div class="card mb-3 ${cardClass}" data-id="${task.id}">
        <div class="card-body">
          <h5 class="card-title">${task.title}</h5>
          <p class="card-text">${task.description}</p>
          <p class="card-text"><small class="text-muted">Due: ${task.dueDate}</small></p>
          <button class="btn btn-danger btn-sm delete-task">Delete</button>
        </div>
      </div>
    `;
    

}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    ['todo', 'in-progress', 'done'].forEach(status => {
        $(`#${status}-cards`).empty();
        taskList.filter(task => task.status === status).forEach(task => {
          const taskCard = createTaskCard(task);
          const $taskCard = $(taskCard);

          $taskCard.addClass('draggable-task');

          $(`#${status}-cards`).append($taskCard);
          $taskCard.draggable({
            revert: 'invalid',
            start: function() {
              $(this).css('z-index', 1000);
            },
            stop: function() {
              $(this).css('z-index', '');
            }
          });
          if (status === 'done') {
            $taskCard.removeClass('bg-danger bg-warning');
          }
        });
      });
      $('.delete-task').click(handleDeleteTask);
    }

// Todo: create a function to handle adding a new task
function handleAddTask(event){

}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

    $( function() {
        $( "#task-due-date" ).datepicker({
          showButtonPanel: true
        });
      } );
});
