class Api::V1::ShiftsController < Api::V1::BaseController
  before_action :set_shift, only: [:show, :update, :destroy]

  # GET /api/v1/shifts
  def index
    @shifts = Shift.includes(:department, :users).all
    render json: @shifts.as_json(include: { department: {}, users: { only: [:id, :name, :email] } })
  end

  # GET /api/v1/shifts/:id
  def show
    render json: @shift.as_json(include: { department: {}, users: { only: [:id, :name, :email] } })
  end

  # POST /api/v1/shifts
  def create
    @shift = Shift.new(shift_params)
    if @shift.save
      render json: @shift.as_json(include: { department: {} }), status: :created
    else
      render json: { errors: @shift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /api/v1/shifts/:id
  def update
    if @shift.update(shift_params)
      render json: @shift.as_json(include: { department: {} })
    else
      render json: { errors: @shift.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/shifts/:id
  def destroy
    @shift.destroy
    head :no_content
  end

  private

  def set_shift
    @shift = Shift.find(params[:id])
  end

  def shift_params
    params.require(:shift).permit(:date, :start_time, :end_time, :department_id)
  end
end
