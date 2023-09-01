//@desc    get all riders
//@route   GET /api/riders
//@access  public

//@desc    get individual rider stats
//@route   GET /api/riders/:id
//@access  public

//@desc    get all races
//@route   GET /api/races
//@access  public

//@desc    get individual race results
//@route   GET /api/races/:id
//@access  public

//@desc    add rider to team
//@route   POST /api/team
//@access  private

//@desc    delete rider from team
//@route   delete /api/team/:id
//@access  private

//@desc    confirm team selection
//@route   PATCH /api/confirmTeam
//@access  private

//@desc    add teams to league
//@route   PATCH /api/myLeague
//@access  private