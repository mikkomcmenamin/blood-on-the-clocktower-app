using System;
using System.Globalization;
using System.Linq;
using UnityEditor;
using UnityEngine;

#if UNITY_EDITOR && UNITY_IOS
using RanchCode.Editor;
#endif

public static class BuildScript
{
    [MenuItem("Build/Build iOS")]
    public static void BuildIos()
    {
        BuildPlayerOptions buildPlayerOptions = new BuildPlayerOptions
        {
            locationPathName = "ios",
            target = BuildTarget.iOS,
            options = BuildOptions.None,
            scenes = GetScenes()
        };
        
        BuildApp(buildPlayerOptions);
    }

    private static void BuildApp(BuildPlayerOptions buildPlayerOptions)
    {
        SetVersionNumberInCodemagicPipeline(); 
        
        Debug.Log($"Building {buildPlayerOptions.target}");
        BuildPipeline.BuildPlayer(buildPlayerOptions);
        Debug.Log($"Built {buildPlayerOptions.target}");
    }
    
    private static void SetVersionNumberInCodemagicPipeline()
    {
#if UNITY_EDITOR
        DateTime currentDate = DateTime.Now;

        DateTimeFormatInfo dateTimeFormatInfo = DateTimeFormatInfo.CurrentInfo;
        var weekNumber = dateTimeFormatInfo.Calendar.GetWeekOfYear(currentDate, CalendarWeekRule.FirstFourDayWeek, DayOfWeek.Monday);
        var buildNumber = Environment.GetEnvironmentVariable("BUILD_NUMBER");

        if (String.IsNullOrEmpty(buildNumber))
        {
            Debug.LogError("Could not fetch BUILD_NUMBER environment variable"); 
            buildNumber = "0";
        }

        var versionString = currentDate.Year + "." + weekNumber + "." + buildNumber;

        PlayerSettings.bundleVersion = $"{versionString}";

#if UNITY_STANDALONE_OSX
        PlayerSettings.macOS.buildNumber = $"{versionString}";
#elif UNITY_IOS
        PlayerSettings.iOS.buildNumber = $"{versionString}";
#endif

#endif
    }

    private static string[] GetScenes()
    {
        return (from scene in EditorBuildSettings.scenes where scene.enabled select scene.path).ToArray();
    }

}
