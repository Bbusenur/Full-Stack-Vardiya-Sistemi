class Api::V1::ShiftAssignmentsController < Api::V1::BaseController
  before_action :set_shift_assignment, only: [:show, :update, :destroy]

  # GET /api/v1/shift_assignments
  def index
    @shift_assignments = ShiftAssignment.includes(:user, :shift).all
    render json: @shift_assignments.as_json(include: { user: { only: [:id, :name, :email] }, shift: { include: { department: {} } } })
  end

  # GET /api/v1/shift_assignments/:id
  def show
    render json: @shift_assignment.as_json(include: { user: { only: [:id, :name, :email] }, shift: { include: { department: {} } } })
  end

  # POST /api/v1/shift_assignments
  def create
    @shift_assignment = ShiftAssignment.new(shift_assignment_params)
    if @shift_assignment.save
      render json: @shift_assignment.as_json(include: { user: { only: [:id, :name, :email] }, shift: { include: { department: {} } } }), status: :created
    else
      render json: { errors: @shift_assignment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/shift_assignments/:id
  def update
    if @shift_assignment.update(shift_assignment_params)
      render json: @shift_assignment.as_json(include: { user: { only: [:id, :name, :email] }, shift: { include: { department: {} } } })
    else
      render json: { errors: @shift_assignment.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/shift_assignments/:id
  def destroy
    @shift_assignment.destroy
    head :no_content
  end

  private

  def set_shift_assignment
    @shift_assignment = ShiftAssignment.find(params[:id])
  end

  def shift_assignment_params
    params.require(:shift_assignment).permit(:user_id, :shift_id, :status, :notes)
  end
end
