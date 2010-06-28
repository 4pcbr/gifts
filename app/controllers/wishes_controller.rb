class WishesController < ApplicationController
  
  include AuthenticatedSystem
  
  def create
    if !self.current_user
      render :status => 401, :text => "Authorization required"
      return
    end
    
    data = params[:gift]
    
    
    # if (file = params[:gift][:image])
    #       File.open(Rails.root.join('public', 'uploads', self.current_user.id.to_s, file.original_filename), 'w') do |f|
    #         f.write(file.read)
    #       end
    #       f = Image.new(:file_name => file.original_filename, :user_id => self.current_user.id)
    #       if f.save
    #         data[:image_id] = f.id
    #       end
    #       data.delete(:image)
    #     end
    
    if data[:id] != ''
      @gift = Gift.find(data[:id])
      if !@gift
        render :status => 404, :text => "Item not found"
        return
      end
      if !(@gift.user_id == self.current_user.id)
        render :status => 403, :text => "You are not allowed to edit this item"
        return
      end
      id = data.delete(:id)
      Gift.update(id, data)
      @gift = Gift.find(id)
    else
      @gift = Gift.new(params[:gift])
      @gift.user_id = self.current_user.id
    end
    @gift.name = Sanitize.clean(@gift.name, Sanitize::Config::BASIC)
    success = @gift && @gift.save
    
    render :layout => false
    
    if !success
      render :nothing => true
    end
  end
  
  def edit
    user = self.current_user
    gift = Gift.find(params[:i])
    if !gift
      render :status => 500, :text => "gift is not defined"
    end
    
  end
  
  def show
    if !self.current_user
      render :status => 401, :text => "Authorization required"
      return
    end
    wish = Gift.find(params[:i])
    if !wish
      render :status => 404, :text => "Item not found"
      return
    end
    if !(wish.user_id == self.current_user.id)
      render :status => 403, :text => "You are not allowed to edit this item"
      return
    end
    @new_gift = wish
    @form_id = "edit_wish_form"
    render :partial => "wishes/edit_wish"
  end
  
  def update
    action = params[:a]
    wish_id = params[:i]
    begin
      if !self.current_user.id
        raise "authorization required"
      end
      if !action
        raise "no action specified"
      end
      if action == "fp"
        self.fp(wish_id)
      elsif action == 'co'
        self.co(wish_id)
      else
        raise "action is unknown"
      end
    rescue Exception
      render :status => 500, :text => $!
      return
    end
    render :nothing => true
  end
  
  def destroy
    begin
      if !self.current_user.id
        raise "authorization required"
      end
      wish = Gift.find(params['i'])
      if !wish
        raise "wish couldn't be found"
      end
      if !(wish.user_id == self.current_user.id)
        raise "you are not allowed to edit this wish"
      end
      wish.state = -1;
      wish.save
    rescue Exception
      render :status => 500, :text => $!
      return
    end
    render :nothing => true
  end
  
  protected
  
  def fp(wish_id)
    wish = Gift.find(wish_id)
    if !wish
      raise "wish couldn't be found"
    end
    if wish.promised?
      raise "this wish is promised by somebody"
    end
    owner = wish.user
    if !(owner.is_me?(self.current_user) || owner.is_friend?(self.current_user))
      raise "You are not allowed to edit this wish state"
    end
    promise = Promise.new
    promise.user_id = self.current_user.id
    promise.gift_id = wish.id
    promise.save
    wish.state = 1
    wish.save
  end
  
  def co(wish_id)
    wish = Gift.find(wish_id)
    if !wish
      raise "wish couldn't be found"
    end
    owner = wish.user
    if !(owner.id == self.current_user.id)
      raise "only owner allowed to edit his wishes"
    end
    wish.state = 2
    wish.save
  end
end
