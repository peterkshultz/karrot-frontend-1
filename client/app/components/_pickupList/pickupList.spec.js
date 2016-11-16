import PickupListModule from "./pickupList";
import UserModule from "../../common/user/user";
import StoreModule from "../../common/store/store";
import AuthenticationModule from "../../common/authentication/authentication";
import PickupDateModule from "../../common/pickupDate/pickupDate";

describe("PickupList", () => {
  let $componentController, $httpBackend;

  let { module } = angular.mock;

  beforeEach(() => {
    module(PickupListModule);
    module(UserModule);
    module(StoreModule);
    module(AuthenticationModule);
    module(PickupDateModule);

    angular.mock.module(($provide) => {
      $provide.value("$mdDialog", {});
      $provide.value("$document", {});
    });
    inject(($injector) => {
      $httpBackend = $injector.get("$httpBackend");
      $componentController = $injector.get("$componentController");
    });
  });

  afterEach(() => {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  let authData = {
    "id": 1,
    "display_name": "Lars"
  };

  let pickupData = [{
    "id": 15,
    "date": "2016-09-16T21:40:00Z",
    "collector_ids": [],
    "max_collectors": 2,
    "store": 9
  },
    {
      "id": 14,
      "date": "2016-09-16T01:00:00Z",
      "collector_ids": [
        1,
        8
      ],
      "max_collectors": 2,
      "store": 9
    },
    {
      "id": 11,
      "date": "2016-09-17T16:00:00Z",
      "collector_ids": [
        1
      ],
      "max_collectors": 3,
      "store": 9
    },
    {
      "id": 5,
      "date": "2016-09-18T12:00:18Z",
      "collector_ids": [],
      "max_collectors": 5,
      "store": 9
    },
    {
      "id": 4,
      "date": "2017-09-22T20:00:05Z",
      "collector_ids": [],
      "max_collectors": 2,
      "store": 9
    }];

  let pickupDataInfoAdded = [{
    "id": 15,
    "date": "2016-09-16T21:40:00Z",
    "collector_ids": [],
    "max_collectors": 2,
    "store": 9,
    "isUserMember": false,
    "isFull": false
  },
    {
      "id": 14,
      "date": "2016-09-16T01:00:00Z",
      "collector_ids": [
        1,
        8
      ],
      "max_collectors": 2,
      "store": 9,
      "isUserMember": true,
      "isFull": true
    },
    {
      "id": 11,
      "date": "2016-09-17T16:00:00Z",
      "collector_ids": [
        1
      ],
      "max_collectors": 3,
      "store": 9,
      "isUserMember": true,
      "isFull": false
    },
    {
      "id": 5,
      "date": "2016-09-18T12:00:18Z",
      "collector_ids": [],
      "max_collectors": 5,
      "store": 9,
      "isUserMember": false,
      "isFull": false
    },
    {
      "id": 4,
      "date": "2017-09-22T20:00:05Z",
      "collector_ids": [],
      "max_collectors": 2,
      "store": 9,
      "isUserMember": false,
      "isFull": false
    }];

  let fullPickups = [pickupDataInfoAdded[1]];

  let pickupDataInfoAddedGrouped = [
    {
      "date": "2016-09-16",
      "items": [{
        "id": 15,
        "date": "2016-09-16T21:40:00Z",
        "collector_ids": [],
        "max_collectors": 2,
        "store": 9,
        "isUserMember": false,
        "isFull": false
      },
        {
          "id": 14,
          "date": "2016-09-16T01:00:00Z",
          "collector_ids": [
            1,
            8
          ],
          "max_collectors": 2,
          "store": 9,
          "isUserMember": true,
          "isFull": true
        }]
    },
    {
      "date": "2016-09-17",
      "items": [{
        "id": 11,
        "date": "2016-09-17T16:00:00Z",
        "collector_ids": [
          1
        ],
        "max_collectors": 3,
        "store": 9,
        "isUserMember": true,
        "isFull": false
      }]
    },
    {
      "date": "2016-09-18",
      "items": [{
        "id": 5,
        "date": "2016-09-18T12:00:18Z",
        "collector_ids": [],
        "max_collectors": 5,
        "store": 9,
        "isUserMember": false,
        "isFull": false
      }]
    },
    {
      "date": "2017-09-22",
      "items": [{
        "id": 4,
        "date": "2017-09-22T20:00:05Z",
        "collector_ids": [],
        "max_collectors": 2,
        "store": 9,
        "isUserMember": false,
        "isFull": false
      }]
    }];

  let storeData = {
    "id": 9,
    "name": "REWE Neuried"
  };

  describe("Controller with showDetail = date (default)", () => {
    let controller;

    beforeEach(() => {
      controller = $componentController("pickupList", {
      }, {
        storeId: 9,
        options: {
          header: "My amazing Pickups"
        }
      });

      $httpBackend.whenGET("/api/auth/status/").respond(authData);
      $httpBackend.whenGET("/api/pickup-dates/?store=9").respond(pickupData);
    });

    afterEach(() => {
      $httpBackend.flush();
    });


    it("bindings", () => {
      expect(controller.storeId).to.equal(9);
      expect(controller.options.header).to.equal("My amazing Pickups");
    });

    it("automatic update", () => {
      $httpBackend.expectGET("/api/auth/status/").respond(authData);
      $httpBackend.expectGET("/api/pickup-dates/?store=9").respond(pickupData);
    });


    it("addPickupInfo functionality", () => {
      controller.userId = 1;
      controller.addPickupInfosAndDisplay(pickupData);
      let updatedData = controller.allPickups;
      expect(updatedData).to.deep.equal(pickupDataInfoAdded);
      expect(updatedData[0].store).to.deep.equal(9);
    });

    it("filter functionality", () => {
      controller.allPickups = pickupDataInfoAdded;
      controller.options.filter = {
        showJoined: false,
        showOpen: false,
        showFull: true
      };
      expect(controller.filterAndDisplayPickups()).to.deep.equal(fullPickups);
    });

    it("groupByDate functionality", () => {
      expect(controller.groupByDate(pickupDataInfoAdded)).to.deep.equal(pickupDataInfoAddedGrouped);
    });
  });

  describe("Controller with showDetail = store", () => {
    let controller;

    beforeEach(() => {
      controller = $componentController("pickupList", {
      }, {
        storeId: 9,
        options: {
          header: "My amazing Pickups",
          showDetail: "store"
        }
      });

      $httpBackend.whenGET("/api/auth/status/").respond(authData);
      $httpBackend.whenGET("/api/pickup-dates/?store=9").respond(pickupData);
      $httpBackend.whenGET("/api/stores/9/").respond(storeData);
    });

    afterEach(() => {
      $httpBackend.flush();
    });

    it("addPickupInfo get Store Info functionality", () => {
      controller.userId = 1;
      controller.addPickupInfosAndDisplay(pickupData);
      let updatedData = controller.allPickups;
      expect(updatedData[0].storePromise).to.eventually.deep.equal(storeData);
    });
  });
});