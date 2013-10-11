describe('Lunchy events', function() {

  var lunchyEvents;

  beforeEach(module('common'));

  beforeEach(inject(function(_lunchyEvents_) {
    lunchyEvents = _lunchyEvents_;
  }));

  it('should contain loginRequired event', function() {
    expect(lunchyEvents.loginRequired).toBe('lunchy:loginRequired');
  });

});