#if UNITY_EDITOR && UNITY_IOS

using System.IO;
using UnityEditor;
using UnityEditor.Callbacks;
using UnityEditor.iOS.Xcode;

namespace RanchCode.Editor
{
    public class iOSPostBuildProcessor
    {
        [PostProcessBuild]
        public static void OnPostProcessBuild(BuildTarget target, string path)
        {
            if (target != BuildTarget.iOS) return;
            
            ModifyXCodeConfiguration(target, path);
            EditPlist(target, path);
        }

        /// <summary>
        /// If XCode configuration needs to be modified, it can be done here
        /// </summary>
        /// <param name="target"></param>
        /// <param name="path"></param>
        private static void ModifyXCodeConfiguration(BuildTarget target, string path)
        {
            string projPath = PBXProject.GetPBXProjectPath(path);
 
            PBXProject proj = new PBXProject();
            proj.ReadFromFile(projPath);
 
            string targetGUID = proj.GetUnityMainTargetGuid();
            proj.AddBuildProperty(targetGUID, "VALIDATE_WORKSPACE", "YES");
                
            proj.SetBuildProperty(targetGUID, "SUPPORTS_MAC_DESIGNED_FOR_IPHONE_IPAD", "NO");

            proj.WriteToFile(projPath);
        }
        
        private static void EditPlist(BuildTarget target, string path)
        {
            string plistPath = path + "/Info.plist";
            PlistDocument plist = new PlistDocument();
            plist.ReadFromFile(plistPath);

            PlistElementDict rootDict = plist.root;

            // Add ITSAppUsesNonExemptEncryption to Info.plist
            rootDict.SetString("ITSAppUsesNonExemptEncryption", "false");

            File.WriteAllText(plistPath, plist.WriteToString());
        }

    }
}
#endif