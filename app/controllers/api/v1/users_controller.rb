class Api::V1::UsersController < Api::V1::BaseController
  before_action :set_user, only: [:show, :update, :destroy]

  # GET /api/v1/users
  def index
    @users = User.all
    render json: @users.as_json(except: :password_digest)
  end

  # GET /api/v1/users/:id
  def show
    render json: @user.as_json(except: :password_digest)
  end

  # POST /api/v1/users
  def create
    @user = User.new(user_params)
    if @user.save
      render json: @user.as_json(except: :password_digest), status: :created
    else
      render json: { 
        errors: @user.errors.full_messages,
        error_details: @user.errors.as_json
      }, status: :unprocessable_entity
    end
  rescue ActionController::ParameterMissing => e
    render json: { error: "Parameter missing: #{e.param}" }, status: :bad_request
  end

  # PATCH/PUT /api/v1/users/:id
  def update
    if @user.update(user_params)
      render json: @user.as_json(except: :password_digest)
    else
      render json: { errors: @user.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /api/v1/users/:id
  def destroy
    @user.destroy
    head :no_content
  end

  private

  def set_user
    @user = User.find(params[:id])
  end

  def user_params
    params.require(:user).permit(:name, :email, :password, :role)
  end
end
