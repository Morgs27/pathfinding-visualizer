import { Stat } from "../../config/Stats";
import { Theme } from "../../config/Themes";
import Point from "../../types/Point";

type StatsRowProps = {
  stats: Stat[];
  theme: Theme;
  points: Point[];
};

const StatsRow = ({ stats, theme, points }: StatsRowProps) => {
  return (
    <div className="stats">
      <div className="stat">
        <div className="icon">
          <img src={theme.locationDot} alt="point" className="point-icon" />
        </div>
        {" " + points.length}
      </div>

      {stats.map((stat, index) => {
        if (stat.value !== null && stat.value !== 0) {
          return (
            <div key={index} className="stat fadeIn">
              <div className="icon">{stat.icon}</div>
              {stat.showName && `${stat.name}: `}
              {`${stat.value} ${stat.unit || ""}`}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
};

export default StatsRow;
