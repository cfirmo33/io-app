import { Tuple2 } from "italia-ts-commons/lib/tuples";
import {
  getInternalRoute,
  testableALLOWED_ROUTE_NAMES
} from "../../components/ui/Markdown/handlers/internalLink";
import { IO_INTERNAL_LINK_PREFIX } from "../navigation";

describe("getInternalRoute", () => {
  const allowedRoutes = Object.entries(testableALLOWED_ROUTE_NAMES!).map(
    ([r, v]) => Tuple2(`${IO_INTERNAL_LINK_PREFIX}${r}`, v)
  );
  const validRoute = Object.keys(testableALLOWED_ROUTE_NAMES!)[0];
  it("should recognize a valid internal route", () => {
    [
      ...allowedRoutes,
      Tuple2("", ""),
      Tuple2("  some noise  ", "  some noise  "),
      Tuple2(
        allowedRoutes[0].e1 + "suffix",
        allowedRoutes[0].e1.replace(IO_INTERNAL_LINK_PREFIX, "/") + "suffix"
      ),
      Tuple2(
        IO_INTERNAL_LINK_PREFIX + validRoute + "?param1=value1&param2=value2",
        `${
          testableALLOWED_ROUTE_NAMES![validRoute]
        }?param1=value1&param2=value2`
      ),
      Tuple2(
        IO_INTERNAL_LINK_PREFIX + validRoute + "?param1=&param2=value2",
        `${testableALLOWED_ROUTE_NAMES![validRoute]}?param1=&param2=value2`
      )
    ].forEach(tuple => {
      expect(getInternalRoute(tuple.e1)).toEqual(tuple.e2);
    });
  });
});
